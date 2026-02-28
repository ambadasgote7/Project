import express from "express";
import { getCompanyList } from "./company.controller.js";

const router = express.Router();

// Public — used in onboarding
router.get("/list", getCompanyList);

export default router;