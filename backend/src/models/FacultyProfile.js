import mongoose from "mongoose";

const facultyProfileSchema = new mongoose.Schema(
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

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
    },

    courseName: {
      type: String
    },

    specialization: {
      type: String
    },

    designation: {
      type: String
    },

    phoneNo: {
      type: String
    },

    employeeId: {
      type: String
    },

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
      enum: ["active", "inactive"],
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
// EmployeeId unique per college
//
facultyProfileSchema.index(
  { college: 1, employeeId: 1 },
  { unique: true, sparse: true }
);


const FacultyProfile = mongoose.model(
  "FacultyProfile",
  facultyProfileSchema
);

export default FacultyProfile;