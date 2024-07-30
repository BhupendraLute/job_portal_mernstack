import JobPost from "../models/job_posting.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import checkResumeFormat from "../utils/checkResumeFormat.js"
import JobApplication from "../models/job_application.model.js"
import { User } from "../models/user.model.js"

const createJobPost = asyncHandler(async (req, res) => {
    try {
        const { title, company, description, jobType, salary, location, applicationDeadline } = req.body

        const user = req.user

        // check user is employer
        if (user.role !== 'employer') {
            res.status(401)
            throw new ApiError(401, 'User not authorized employer, please login as employer')
        }

        if (!title || !company || !description || !jobType || !salary || !location || !applicationDeadline) {
            res.status(400)
            throw new ApiError(400, 'Please fill all the fields')
        }

        // create job posting
        const jobPost = await JobPost.create({
            title,
            company,
            description,
            jobType,
            salary,
            location,
            applicationDeadline,
            employer: user._id
        })

        if (!jobPost) {
            throw new ApiError(500, "Something went wrong while posting the job")
        }

        return res.status(201).json(
            new ApiResponse(200, jobPost, "Job posting created successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error while posting job")
    }
})

const updateJobPost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { title, company, description, jobType, salary, location, applicationDeadline } = req.body

        const user = req.user

        // check user is employer
        if (user.role !== 'employer') {
            res.status(401)
            throw new ApiError(401, 'User not authorized employer, please login as employer')
        }

        const jobPost = await JobPost.findById(id)

        if (!jobPost) {
            throw new ApiError(404, "Job posting not found")
        }

        const newPost = {
            title: title || jobPost.title,
            company: company || jobPost.company,
            description: description || jobPost.description,
            jobType: jobType || jobPost.jobType,
            salary: salary || jobPost.salary,
            location: location || jobPost.location,
            applicationDeadline: applicationDeadline || jobPost.applicationDeadline
        }

        const updatedJobPost = await JobPost.findByIdAndUpdate(id, newPost)

        return res.status(200).json(
            new ApiResponse(200, updatedJobPost, "Job posting updated successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while updating job post')
    }
})

const removeJobPost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // check user is employer
        if (user.role !== 'employer') {
            res.status(401);
            throw new ApiError(401, 'User not authorized employer, please login as employer');
        }

        const jobPost = await JobPost.findByIdAndDelete(id);

        if (!jobPost) {
            throw new ApiError(404, "Job posting not found");
        }

        return res.status(200).json(
            new ApiResponse(200, null, "Job posting removed successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while removing job post');
    }
});


const getJobPost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const jobPost = await JobPost.findById(id)

        if (!jobPost) {
            throw new ApiError(404, "Job posting not found")
        }

        return res.status(200).json(
            new ApiResponse(200, jobPost, "Job post fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while fetching job post')
    }
})

const getAllJobPosts = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skipCount = (page - 1) * limit;

        const jobPosts = await JobPost.find()
            .skip(skipCount)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalCount = await JobPost.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                jobs: jobPosts,
                currentPage: page,
                totalPages,
                totalCount,
            }, "Job posts fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while fetching job posts');
    }
});

//  get job posts for logged in employer only
const getJobPostsByEmployer = asyncHandler(async (req, res) => {
    try {
        const user = req.user;

        // check user is employer
        if (user.role !== 'employer') {
            res.status(401);
            throw new ApiError(401, 'User not authorized employer, please login as employer');
        }

        const jobPosts = await JobPost.find({ employer: user._id });

        return res.status(200).json(
            new ApiResponse(200, jobPosts, "Job posts fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while fetching job posts');
    }
});

const searchJobPosts = asyncHandler(async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const skipCount = (page - 1) * limit;

        const jobPosts = await JobPost.find({
            $or: [
                { title: { $regex: new RegExp(q, 'i') } },
                { company: { $regex: new RegExp(q, 'i') } },
                { salary: { $regex: new RegExp(q, 'i') } },
                { location: { $regex: new RegExp(q, 'i') } },
                { description: { $regex: new RegExp(q, 'i') } },
                { jobType: { $regex: new RegExp(q, 'i') } },
            ]
        })
            .select("-applications")
            .skip(skipCount)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalCount = await JobPost.countDocuments({
            $text: { $search: q }
        });
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                jobs: jobPosts,
                currentPage: page,
                totalPages,
                totalCount,
            }, "Job posts fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while searching job posts');
    }
});


const getApplicationsByJobId = asyncHandler(async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (req.user.role !== 'employer') {
            throw new ApiError(403, 'Only employers can view job applications');
        }

        const job = await JobPost.findById(jobId);
        const totalApplications = job.applications.length;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const jobApplications = job.applications.slice(startIndex, endIndex);

        return res.status(200).json(
            new ApiResponse(200, {
                jobApplications,
                totalApplications,
                currentPage: page,
                totalPages: Math.ceil(totalApplications / limit)
            }, 'Job applications fetched successfully')
        );
    } catch (error) {
        throw new ApiError(500, error.message || 'Error while fetching Job applications');
    }
});


// apply to the job as an applicant
const applyJob = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // job-post id
        const applicant = req.user
        const job = await JobPost.findById(id)
        const resume = applicant?.resume ? applicant.resume : null;

        const user = await User.findById(applicant._id)

        if (!user) {
            throw new ApiError(404, "User not found")
        } else if (user.role !== "jobseeker") {
            throw new ApiError(403, "Only applicants can apply for the job")
        }

        if (!job) {
            throw new ApiError(404, "Job not found")
        }

        const application = {
            applicant: user._id,
            job: job._id,
            resume: resume,
        }

        const createdApplication = await JobApplication.create(application)

        if (!createdApplication) {
            throw new ApiError(500, "Something went wrong while applying for the job")
        }

        job.applications.push({ applicant: applicant._id, resume: resume })

        await job.save();

        return res.status(200).json(
            new ApiResponse(200, null, "Job applied successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error while applying the job")
    }
})

// update the job application status as an employer
const updateJobApplicationStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params; // application id
        const user = req.user

        // check user is employer
        if (user.role !== 'employer') {
            res.status(401)
            throw new ApiError(401, 'User not authorized employer, please login as employer')
        }

        if (!status) {
            throw new ApiError(400, "Application status is required")
        } else if (!["accepted", "rejected"].includes(status)) {
            throw new ApiError(400, "Invalid status value")
        }

        // Find the job application by ID
        const application = await JobApplication.findById(id);

        if (!application) {
            throw new ApiError(404, "Job application not found");
        }

        // Update the application status
        application.status = status;
        await application.save();

        return res.status(200).json(
            new ApiResponse(200, null, "Job application status updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error while updating application status")
    }
});

const downloadResume = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // PublicId of resume

        
    } catch (error) {
        throw new ApiError(500, error.message || "Error while downloading resume");
    }
});

export {
    createJobPost,
    removeJobPost,
    updateJobPost,
    getJobPost,
    getAllJobPosts,
    getJobPostsByEmployer,
    searchJobPosts,
    getApplicationsByJobId,
    applyJob,
    updateJobApplicationStatus
}