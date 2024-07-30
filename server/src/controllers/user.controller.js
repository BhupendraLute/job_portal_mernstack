import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import checkResumeFormat from "../utils/checkResumeFormat.js";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    let avatar;

    try {
        const { firstName, middleName, lastName, username, email, password, role, dob } = req.body

        if ([firstName, middleName, lastName, username, email, password, role, dob].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists")
        }

        const user = await User.create({
            fullName: {
                firstName, middleName, lastName
            },
            email,
            username,
            password,
            role,
            dob,
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            await removeFromCloudinary(avatar.public_id)
            throw new ApiError(500, "Something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }

})

const loginUser = asyncHandler(async (req, res) => {

    try {
        const { email, username, password } = req.body

        if (!username && !email) {
            throw new ApiError(400, "username or email is required")
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (!user) {
            throw new ApiError(404, "User does not exist")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while login")
    }

})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while logout")
    }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(req.user?._id)
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password")
        }

        user.password = newPassword
        await user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password changed successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while changing password")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select(
            "-password -refreshToken"
        )
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                req.user,
                "User fetched successfully"
            ))
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while fetching user")
    }
})

// get user with id
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            "-password -refreshToken"
        )
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                user,
                "User fetched successfully"
            ))
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while fetching user")
    }
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, dob } = req.body

        if (!firstName || !middleName || !lastName || !email || !dob) {
            throw new ApiError(400, "please provide all fields")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName: {
                        firstName, middleName, lastName
                    },
                    email: email,
                    dob: dob
                }
            },
            { new: true }

        ).select("-password")

        return res
            .status(200)
            .json(new ApiResponse(200, user, "Account details updated successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while updating account details")
    }
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    try {
        const avatarLocalPath = req.file?.path

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is missing")
        }

        // chaexk avatar is image file
        if (!avatarLocalPath.endsWith(".png") && !avatarLocalPath.endsWith(".jpg")) {
            throw new ApiError(400, "Avatar file should be in png or jpg format")
        }

        console.log(req.user?.avatar)

        if (req.user?.avatar) {
            await removeFromCloudinary(req.user?.avatar);
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if (!avatar.url) {
            throw new ApiError(400, "Error while uploading on avatar")

        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            { new: true }
        ).select("-password")

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "Avatar image updated successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while updating avatar")
    }
})

const updateResume = asyncHandler(async (req, res) => {
    try {
        const resumeLocalPath = req.file?.path

        if (!resumeLocalPath) {
            throw new ApiError(400, "Resume file is missing")
        }

        // check resume is in pdf format
        checkResumeFormat(resumeLocalPath)

        if (req.user?.resume) {
            await removeFromCloudinary(req.user?.resume);
        }

        const resume = await uploadOnCloudinary(resumeLocalPath)

        if (!resume.url) {
            throw new ApiError(400, "Error while uploading on resume")

        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    resume: resume.url
                }
            },
            { new: true }
        ).select("-password")

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "Resume updated successfully")
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Error while updating resume")
    }
})

const addExperiance = asyncHandler(async (req, res) => {
    try {
        const { company, position, startDate, endDate, description } = req.body

        if (!company || !position || !startDate || !endDate || !description) {
            throw new ApiError(400, "Please provide all fields")
        }

        if (!req.user || !req.user.id) {
            throw new ApiError(401, "Unauthorized request")
        }

        const userWithUpdatedExperience = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push: {
                    experience: {
                        company, position, startDate, endDate, description
                    }
                }
            },
            { new: true }
        ).select("-password")

        if (!userWithUpdatedExperience) {
            throw new ApiError(500, error?.message || "Error while adding experience")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, userWithUpdatedExperience, "Experience added successfully")
            )

    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const editExperiance = asyncHandler(async (req, res) => {
    try {
        const { company, position, startDate, endDate, description } = req.body

        const expId = req.params.id

        if (!company || !position || !startDate || !endDate || !description) {
            throw new ApiError(400, "Please provide all fields")
        }

        if (!req.user || !req.user.id) {
            throw new ApiError(401, "Unauthorized request")
        }

        const userWithUpdatedExperience = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    "experience.$[inner].company": company,
                    "experience.$[inner].position": position,
                    "experience.$[inner].startDate": startDate,
                    "experience.$[inner].endDate": endDate,
                    "experience.$[inner].description": description
                }
            },
            {
                arrayFilters: [{ "inner._id": expId }],
                new: true
            }
        ).select("-password")

        if (!userWithUpdatedExperience) {
            throw new ApiError(500, "Error while updating experience")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, userWithUpdatedExperience, "Experience updated successfully")
            )

    } catch (error) {
        throw new ApiError(500, error.message || "Error while updating experience")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateResume,
    addExperiance,
    editExperiance,
    getUserById
}