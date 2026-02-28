import crypto from "crypto";
import mongoose from "mongoose";

import User from "../../models/User.js";
import StudentProfile from "../../models/StudentProfile.js";
import FacultyProfile from "../../models/FacultyProfile.js";
import MentorProfile from "../../models/MentorProfile.js";

import createUserWithToken from "../../utils/createUser.js";
import sendEmail from "../../utils/sendEmail.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

/* ======================================================
   INVITE STUDENT
====================================================== */

export const inviteStudentService = async (body, creator) => {
  const {
    email,
    fullName,
    courseName,
    specialization,
    courseStartYear,
    courseEndYear
  } = body;

  if (!email || !fullName) {
    throw new Error("Email and full name required");
  }

  const collegeId = creator.referenceId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, rawToken } = await createUserWithToken({
      email,
      role: "student",
      referenceModel: "StudentProfile",
      createdBy: creator._id
    });

    const profile = await StudentProfile.create(
      [
        {
          user: user._id,
          fullName,
          college: collegeId,
          courseName,
          specialization,
          courseStartYear,
          courseEndYear,
          profileStatus: "pending",
          createdBy: creator._id
        }
      ],
      { session }
    );

    user.referenceId = profile[0]._id;
    await user.save({ session });

    await session.commitTransaction();

    const link =
      `${process.env.FRONTEND_URL}/setup-account?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Student Account Invitation",
      html: `<p>Setup your account:</p><a href="${link}">${link}</a>`
    });

    return profile[0];

  } catch (err) {
    await session.abortTransaction();
    throw err;
  }
};

/* ======================================================
   INVITE FACULTY
====================================================== */

export const inviteFacultyService = async (body, creator) => {
  const { email, fullName, courseName, specialization, designation } = body;

  const collegeId = creator.referenceId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, rawToken } = await createUserWithToken({
      email,
      role: "faculty",
      referenceModel: "FacultyProfile",
      createdBy: creator._id
    });

    const profile = await FacultyProfile.create(
      [
        {
          user: user._id,
          fullName,
          college: collegeId,
          courseName,
          specialization,
          designation,
          profileStatus: "pending",
          createdBy: creator._id
        }
      ],
      { session }
    );

    user.referenceId = profile[0]._id;
    await user.save({ session });

    await session.commitTransaction();

    const link =
      `${process.env.FRONTEND_URL}/setup-account?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Faculty Account Invitation",
      html: `<p>Setup your account:</p><a href="${link}">${link}</a>`
    });

    return profile[0];

  } catch (err) {
    await session.abortTransaction();
    throw err;
  }
};

export const inviteMentorService = async (body, creator) => {

  const {
    email,
    fullName,
    designation,
    department,
    employeeId
  } = body;

  if (!email || !fullName) {
    throw new Error("Email and full name required");
  }

  const companyId = creator.referenceId;

  if (!companyId) {
    throw new Error("Invalid company context");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    /* ---------- CREATE USER ---------- */

    const { user, rawToken } = await createUserWithToken({
      email,
      role: "mentor",
      referenceModel: "MentorProfile",
      createdBy: creator._id
    });

    /* ---------- CREATE PROFILE ---------- */

    const profile = await MentorProfile.create(
      [
        {
          user: user._id,
          fullName,
          company: companyId,
          designation,
          department,
          employeeId,
          status: "active",
          createdBy: creator._id
        }
      ],
      { session }
    );

    user.referenceId = profile[0]._id;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    /* ---------- EMAIL ---------- */

    const setupLink =
      `${process.env.FRONTEND_URL}/setup-account?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Mentor Account Invitation",
      html: `
        <p>Your mentor account has been created.</p>
        <p>Set your password here:</p>
        <a href="${setupLink}">${setupLink}</a>
      `
    });

    return profile[0];

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ======================================================
   GET SETUP DATA
====================================================== */

export const getSetupDataService = async (token) => {
  const hashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordSetupToken: hashed,
    passwordSetupExpires: { $gt: Date.now() }
  });

  if (!user) throw new Error("Invalid or expired token");

  let profile;

  if (user.role === "student") {
    profile = await StudentProfile.findById(user.referenceId)
      .populate("college", "name");
  }

  if (user.role === "faculty") {
    profile = await FacultyProfile.findById(user.referenceId)
      .populate("college", "name");
  }

  return {
    role: user.role,
    email: user.email,
    profile
  };
};

/* ======================================================
   SETUP ACCOUNT (PASSWORD + PROFILE)
====================================================== */

export const setupAccountService = async ({ body, files }) => {

  const { token, password } = body;

  if (!token || !password) {
    throw new Error("Token and password are required");
  }

  // =============================
  // Parse profileData safely
  // =============================
  let profileData = body.profileData;

  if (typeof profileData === "string") {
    try {
      profileData = JSON.parse(profileData);
    } catch {
      profileData = {};
    }
  }

  if (!profileData) profileData = {};


  // =============================
  // Verify token
  // =============================
  const hashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordSetupToken: hashed,
    passwordSetupExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Invalid or expired setup link");
  }


  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // =============================
    // Update User
    // =============================
    user.password = password;
    user.passwordSetupToken = undefined;
    user.passwordSetupExpires = undefined;
    user.isRegistered = true;
    user.isVerified = true;

    await user.save({ session });


    /* =====================================================
       STUDENT
    ===================================================== */

    if (user.role === "student") {

      const profile = await StudentProfile
        .findById(user.referenceId)
        .session(session);

      if (!profile) throw new Error("Student profile not found");


      // PRN (lock only if provided)
      if (profileData.prn) {
        profile.prn = profileData.prn;
        profile.prnLocked = true;
      }

      profile.phoneNo = profileData.phoneNo || profile.phoneNo;
      profile.skills = profileData.skills || [];
      profile.bio = profileData.bio || "";


      // Resume Upload
      if (files?.resume?.[0]) {
        const upload = await uploadToCloudinary(
          files.resume[0],
          "student-resumes"
        );
        profile.resumeUrl = upload.secure_url;
      }


      // College ID Upload
      if (files?.collegeIdCard?.[0]) {
        const upload = await uploadToCloudinary(
          files.collegeIdCard[0],
          "student-id-cards"
        );
        profile.collegeIdCardUrl = upload.secure_url;
      }


      profile.profileStatus = "completed";
      profile.profileCompletedAt = new Date();

      await profile.save({ session });
    }


    /* =====================================================
       FACULTY
    ===================================================== */

    if (user.role === "faculty") {

      const profile = await FacultyProfile
        .findById(user.referenceId)
        .session(session);

      if (!profile) throw new Error("Faculty profile not found");

      profile.phoneNo = profileData.phoneNo || profile.phoneNo;
      profile.designation = profileData.designation || profile.designation;

      profile.profileStatus = "completed";
      profile.profileCompletedAt = new Date();

      await profile.save({ session });
    }


    /* =====================================================
       MENTOR
    ===================================================== */

    if (user.role === "mentor") {

      const profile = await MentorProfile
        .findById(user.referenceId)
        .session(session);

      if (!profile) throw new Error("Mentor profile not found");

      profile.phoneNo = profileData.phoneNo || profile.phoneNo;
      profile.designation = profileData.designation || profile.designation;
      profile.department = profileData.department || profile.department;

      profile.status = "active";

      await profile.save({ session });
    }


    await session.commitTransaction();

    return {
      success: true,
      message: "Account setup successful"
    };

  } catch (err) {

    await session.abortTransaction();
    throw err;

  } finally {
    session.endSession();
  }
};