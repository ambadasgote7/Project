import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    // 🔥 Student fills during setup
    prn: {
      type: String,
      trim: true
    },

    prnLocked: {
      type: Boolean,
      default: false
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
    },

    courseName: {
      type: String,
      required: true
    },

    specialization: {
      type: String,
      required: true
    },

    courseStartYear: {
      type: Number
    },

    courseEndYear: {
      type: Number
    },

    phoneNo: String,

    collegeIdCardUrl: String,

    resumeUrl: String,

    skills: [
      {
        type: String
      }
    ],

    bio: String,

    // 🔥 Profile completion tracking
    profileStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    },

    profileCompletedAt: Date,

    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  {
    timestamps: true
  }
);

//
// PRN unique per college (only when exists)
//
studentProfileSchema.index(
  { college: 1, prn: 1 },
  { unique: true, sparse: true }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;