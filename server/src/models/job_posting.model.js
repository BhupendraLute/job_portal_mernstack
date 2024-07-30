import mongoose from 'mongoose';
import moment from 'moment-timezone';


const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['fulltime', 'parttime', 'contract', 'internship'],
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applications: [
    {
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      resume: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Middleware to format the applicationDeadline to Indian timezone before saving
jobPostingSchema.pre('save', function(next) {
  if (this.isModified('applicationDeadline')) {
    this.applicationDeadline = moment.tz(this.applicationDeadline, 'Asia/Kolkata').toDate();
  }
  next();
});

// Middleware to format the applicationDeadline to Indian timezone after retrieving
jobPostingSchema.post('init', function(doc) {
  if (doc.applicationDeadline) {
    doc.applicationDeadline = moment(doc.applicationDeadline).tz('Asia/Kolkata').format('YYYY-MM-DD');
  }
});

// Create a text index on the fields to search
jobPostingSchema.index({ 
  title: 'text',
  company: 'text',
  description: 'text',
  jobType: 'text',
  salary: 'text',
  location: 'text',
});

const JobPost = mongoose.model('JobPost', jobPostingSchema);

export default JobPost;