import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
      index: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      index: true
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyProfile",
      index: true
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "selected",
        "rejected",
        "withdrawn",
        "ongoing",
        "completed",
        "terminated"
      ],
      default: "applied",
      index: true
    },

    appliedAt: {
      type: Date,
      default: Date.now
    },

    selectionDate: Date,

    internshipStartDate: Date,

    internshipEndDate: Date,

    evaluationScore: Number,

    mentorFeedback: String,

    facultyFeedback: String,

    certificateUrl: String,

    remarks: String
  },
  {
    timestamps: true
  }
);

//
// UNIQUE COMPOUND INDEX → prevent duplicate applications
//
applicationSchema.index(
  { student: 1, internship: 1 },
  { unique: true }
);



const Application = mongoose.model("Application", applicationSchema);

export default Application;