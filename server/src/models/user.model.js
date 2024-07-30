import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import moment from 'moment-timezone';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowecase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ["jobseeker", "employer"],
            required: [true, 'Role is required']
        },
        fullName: {
            firstName: {
                type: String,
                trim: true,
                required: [true, 'First name is required']
            },
            middleName: {
                type: String,
                trim: true
            },
            lastName: {
                type: String,
                trim: true,
                required: [true, 'Last name is required']
            }
        },
        dob: {
            type: Date
        },
        resume: {
            type: String, // cloudinary url
        },
        avatar: {
            type: String, // cloudinary url
        },
        experience: [
            {
                company: {
                    type: String,
                    trim: true,
                },
                position: {
                    type: String,
                    trim: true
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                description: {
                    type: String,
                    trim: true
                }
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


// Middleware to format the date before saving
userSchema.pre('save', function (next) {
    if (this.dob) {
        // Convert the date to the Indian time zone
        this.dob = moment.tz(this.dob, 'Asia/Kolkata').toDate();
    }
    next();
});

// Middleware to format the date after retrieving
userSchema.post('init', function (doc) {
    if (doc.dob) {
        // Format the date in the Indian time zone
        doc.dob = moment(doc.dob).tz('Asia/Kolkata').format('YYYY-MM-DD');
    }
});

// Middleware to format the start and end dates for experience
userSchema.pre('save', function(next) {
    if (this.isModified('experience')) {
      this.experience.forEach(exp => {
        if (exp.startDate) {
          exp.startDate = moment.tz(exp.startDate, 'Asia/Kolkata').toDate();
        }
        if (exp.endDate) {
          exp.endDate = moment.tz(exp.endDate, 'Asia/Kolkata').toDate();
        }
      });
    }
    next();
  });
  
  // Middleware to format the start and end dates for experience after retrieving
  userSchema.post('init', function(doc) {
    if (doc.experience) {
      doc.experience.forEach(exp => {
        if (exp.startDate) {
          exp.startDate = moment(exp.startDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
        }
        if (exp.endDate) {
          exp.endDate = moment(exp.endDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
        }
      });
    }
  });

export const User = mongoose.model("User", userSchema)