import StudentProfile from "../../models/StudentProfile.js";
import {uploadToCloudinary} from "../../utils/uploadToCloudinary.js";


// =============================
// GET PROFILE
// =============================
export const getStudentProfileService = async (userId) => {

  const profile = await StudentProfile
    .findOne({ user: userId })
    .populate({
      path: "college",
      select: "name"
    });

  if (!profile) {
    throw new Error("Student profile not found");
  }

  return profile;
};



// =============================
// UPDATE PROFILE (STUDENT SELF)
// =============================
export const updateStudentProfileService = async (userId, body, file) => {

  const profile = await StudentProfile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Student profile not found");
  }


  // 🔒 Strict whitelist (text fields only)
  const allowedFields = [
    "fullName",
    "phoneNo",
    "skills",
    "bio"
  ];


  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      profile[field] = body[field];
    }
  });


  // =============================
  // Resume Upload (NEW)
  // =============================
  if (file) {

    const upload = await uploadToCloudinary(
      file,
      "student-resumes"
    );

    profile.resumeUrl = upload.secure_url;
  }


  // =============================
  // Profile Completion Logic
  // =============================
  const requiredFields = [
    profile.fullName,
    profile.phoneNo,
    profile.resumeUrl
  ];

  const isComplete = requiredFields.every(Boolean);

  if (isComplete && profile.profileStatus !== "completed") {
    profile.profileStatus = "completed";
    profile.profileCompletedAt = new Date();
  }


  await profile.save();

  return profile;
};