import express from "express";
import {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCollegeProfile,
  updateCollegeProfile,
  getCollegeList
} from "./college.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";

const router = express.Router();

// public list endpoint (used by registration form)
router.get("/list", getCollegeList);

// all other college routes require authenticated college users
router.use(authenticate, authorizeRoles("college"));

router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.patch("/courses/:courseName", updateCourse);
router.delete("/courses/:courseName", deleteCourse);

// ================= COLLEGE SELF =================

router.get(
  "/profile",
  authenticate,
  authorizeRoles("college", "admin"),
  getCollegeProfile
);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles("college", "admin"),
  updateCollegeProfile
);


// ================= ADMIN ACCESS ANY =================

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  getCollegeProfile
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  updateCollegeProfile
);


export default router;