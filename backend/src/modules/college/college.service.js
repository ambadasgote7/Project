import College from "../../models/College.js";

/* ======================================
   GET COURSES
====================================== */

export const getCoursesService = async (user) => {
  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  return college.courses;
};


/* ======================================
   ADD COURSE
====================================== */

export const addCourseService = async (user, body) => {

  const { name, durationYears, specializations } = body;

  if (!name || !durationYears) {
    throw new Error("Course name and duration required");
  }

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  const exists = college.courses.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    throw new Error("Course already exists");
  }

  college.courses.push({
    name,
    durationYears,
    specializations: specializations || []
  });

  await college.save();

  return college.courses;
};


/* ======================================
   UPDATE COURSE
====================================== */

export const updateCourseService = async (
  user,
  courseName,
  body
) => {

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  const course = college.courses.find(
    c => c.name === courseName
  );

  if (!course) throw new Error("Course not found");

  if (body.name) course.name = body.name;
  if (body.durationYears) course.durationYears = body.durationYears;
  if (body.specializations) course.specializations = body.specializations;

  await college.save();

  return college.courses;
};


/* ======================================
   DELETE COURSE
====================================== */

export const deleteCourseService = async (
  user,
  courseName
) => {

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  college.courses = college.courses.filter(
    c => c.name !== courseName
  );

  await college.save();

  return college.courses;
};


export const getCollegeListService = async () => {

  const colleges = await College.find(
    { status: "active" },
    "_id name"
  ).sort({ name: 1 });

  return colleges;
};

// ================= GET PROFILE =================
export const getCollegeProfileService = async (user, collegeId) => {

  let id;

  if (user.role === "admin" && collegeId) {
    id = collegeId;               // admin viewing any
  } else {
    id = user.referenceId;        // college viewing own
  }

  const college = await College.findById(id);

  if (!college) {
    throw new Error("College not found");
  }

  return college;
};


// ================= UPDATE PROFILE =================
export const updateCollegeProfileService = async (
  user,
  body,
  collegeId
) => {

  let id;

  if (user.role === "admin" && collegeId) {
    id = collegeId;
  } else {
    id = user.referenceId;
  }

  const college = await College.findById(id);

  if (!college) {
    throw new Error("College not found");
  }


  // Editable fields
  const allowedFields = [
    "name",
    "website",
    "phone",
    "address",
    "description"
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      college[field] = body[field];
    }
  });

  await college.save();

  return college;
};