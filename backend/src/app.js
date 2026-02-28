
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ROUTE MODULES
import authRoutes from "./modules/auth/auth.routes.js";
import onboardingRoutes from "./modules/onboarding/onboarding.routes.js";
import collegeRoutes from "./modules/college/college.routes.js";
import companyRoutes from "./modules/company/company.routes.js";
// import internshipRoutes from "./modules/internship/internship.routes.js";
// import applicationRoutes from "./modules/application/application.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();

/* ---------------------------------------
   CORS
---------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ---------------------------------------
   MIDDLEWARE
---------------------------------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------------------------------
   HEALTH CHECK
---------------------------------------- */
app.get("/", (req, res) => {
  res.send("InternStatus API running");
});

/* ---------------------------------------
   API ROUTES
---------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/company", companyRoutes);
// app.use("/api/internships", internshipRoutes);
// app.use("/api/applications", applicationRoutes);
app.use("/api/users", usersRoutes);

/* ---------------------------------------
   404 HANDLER
---------------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

export default app;