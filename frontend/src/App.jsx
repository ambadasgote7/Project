import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import appStore from "./store/appStore";

/* API */
import API from "./api/api";

/* Redux actions */
import { addUser, removeUser } from "./store/userSlice";

/* Layout */
import MainLayout from "./layouts/MainLayout";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import CompanyRegister from "./pages/company/CompanyRegister";
import CollegeRegister from "./pages/college/CollegeRegister";

/* Dashboards */
import StudentDashboard from "./pages/students/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import MentorDashboard from "./pages/mentor/MentorDashboard";

/* Admin */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CollegeRequests from "./pages/admin/CollegeRequests";
import CompanyRequests from "./pages/admin/CompanyRequests";

import SetPassword from "./pages/SetPassword";

import ProtectedRoute from "./routes/ProtectedRoute";

import CollegeDashboard from "./pages/college/CollegeDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";

import InviteStudent from "./pages/faculty/InviteStudent";
import InviteFaculty from "./pages/college/InviteFaculty";
import Courses from "./pages/college/Courses";
import InviteMentor from "./pages/company/InviteMentor";
import StudentProfile from "./pages/students/StudentProfile";
import CollegeProfile from "./pages/college/CollegeProfile";
import AdminCollegeProfile from "./pages/admin/AdminCollegeProfile";


function AppContent() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const initAuth = async () => {

      try {

        // ✅ Check if session exists via API (rely on cookie)
        const res = await API.get("/users/profile");

        dispatch(addUser({
          user: res.data.user,
          profile: res.data.profile,
          token: null // Token is in httpOnly cookie
        }));

      } catch (err) {

        dispatch(removeUser());

      } finally {
        setLoading(false);
      }
    };

  initAuth();

}, [dispatch]);

useEffect(() => {

  const handleStorageChange = () => {

    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(removeUser());
    }

  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };

}, [dispatch]);

  if (loading) return null;


  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/college/register" element={<CollegeRegister />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/setup-account" element={<SetPassword />} />
        </Route>

        <Route element={<ProtectedRoute role="college" />}>
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/college/invite-student" element={<InviteStudent />} />
          <Route path="/college/invite-faculty" element={<InviteFaculty />} />
          <Route path="/college/courses" element={<Courses />} />
          <Route path="/college/profile" element={<CollegeProfile />} />
        </Route>

        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        <Route element={<ProtectedRoute role="faculty" />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/invite-student" element={<InviteStudent />} />
        </Route>

        <Route element={<ProtectedRoute role="company" />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/invite-mentor" element={<InviteMentor />} />
        </Route>

        <Route element={<ProtectedRoute role="mentor" />}>
          <Route path="/mentor" element={<MentorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/college-requests" element={<CollegeRequests />} />
          <Route path="/admin/company-requests" element={<CompanyRequests />} />
          <Route path="/admin/colleges" element={<AdminCollegeProfile />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="*" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}


function App() {
  return (
    <Provider store={appStore}>
      <AppContent />
    </Provider>
  );
}

export default App;