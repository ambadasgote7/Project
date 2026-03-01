import StudentProfile from "../../models/StudentProfile.js";


// ======================================
// GET FACULTY STUDENTS
// ======================================

export const getFacultyStudentsService = async (user) => {

  const faculty = user.referenceId;

  const facultyProfile = await StudentProfile.db
    .model("FacultyProfile")
    .findById(faculty);

  const students = await StudentProfile.find({
    college: facultyProfile.college,
    courseName: facultyProfile.courseName,
    specialization: facultyProfile.department,
    status: "active"
  })
    .populate("user", "email")
    .lean();

  return students;
};



// ======================================
// UPDATE STUDENT BY FACULTY
// ======================================

export const updateFacultyStudentService = async (
  user,
  studentId,
  body
) => {

  const student = await StudentProfile.findById(studentId);

  if (!student) throw new Error("Student not found");

  const allowed = ["prn", "phoneNo", "skills", "bio"];

  allowed.forEach(field => {
    if (body[field] !== undefined) {
      student[field] = body[field];
    }
  });

  await student.save();

  return student;
};