import StudentProfile from "../../models/StudentProfile.js";
import StudentAcademicHistory from "../../models/StudentAcademicHistory.js";
import User from "../../models/User.js";


// ======================================
// GET COLLEGE STUDENTS
// ======================================

export const getCollegeStudentsService = async (user) => {

  const collegeId = user.referenceId;

  const students = await StudentProfile.find({
    college: collegeId,
    status: "active"
  })
    .populate("user", "email")
    .lean();

  return students;
};



// ======================================
// UPDATE STUDENT
// ======================================

export const updateCollegeStudentService = async (
  user,
  studentId,
  body
) => {

  const collegeId = user.referenceId;

  const student = await StudentProfile.findOne({
    _id: studentId,
    college: collegeId
  });

  if (!student) throw new Error("Student not found");

  const allowedFields = [
    "courseName",
    "specialization",
    "courseStartYear",
    "courseEndYear",
    "prn",
    "phoneNo"
  ];

  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      student[field] = body[field];
    }
  });

  await student.save();

  return student;
};



// ======================================
// REMOVE STUDENT FROM COLLEGE
// ======================================

export const removeStudentFromCollegeService = async (
  user,
  studentId
) => {

  const collegeId = user.referenceId;
  const adminId = user._id;

  const student = await StudentProfile.findOne({
    _id: studentId,
    college: collegeId
  });

  if (!student) throw new Error("Student not found");

  // end academic history
  await StudentAcademicHistory.updateOne(
    {
      student: studentId,
      status: "active"
    },
    {
      endDate: new Date(),
      status: "ended",
      endedBy: adminId
    }
  );

  // unassign
  student.college = null;
  student.courseName = null;
  student.specialization = null;
  student.status = "unassigned";

  await student.save();

  // reset credentials for reassignment
  const userDoc = await User.findById(student.user);

  if (userDoc) {
    userDoc.password = null;
    userDoc.isRegistered = false;
    userDoc.isVerified = false;
    await userDoc.save();
  }

  return { success: true };
};