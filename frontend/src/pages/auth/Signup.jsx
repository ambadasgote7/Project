import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { BASE_URL } from "../../utils/constants";
import { addUser } from "../../store/userSlice";

const ROLE_ENDPOINT_MAP = {
  Student: "/signup/student",
  Faculty: "/signup/faculty",
  Company: "/signup/company",
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectAfterSignup = (role) => {
    if (role === "Student") return "/student/profile";
    if (role === "Faculty") return "/faculty/register";
    if (role === "Company") return "/company/register";
    return "/login";
  };

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !role) {
      setError("All fields are required.");
      return;
    }

    const endpoint = ROLE_ENDPOINT_MAP[role];
    if (!endpoint) {
      setError("Invalid role selected.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth${endpoint}`,
        { email, password },
        { withCredentials: true }
      );

      const userData = res.data?.data;
      if (!userData) {
        setError("Invalid response from server.");
        setSubmitting(false);
        return;
      }

      dispatch(addUser(userData));
      navigate(redirectAfterSignup(userData.role));
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-md shadow-xl border border-[#FFEDC7] p-8 md:p-10 relative transition-all">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Signup
          </h2>
        </div>

        {error && (
          <div className="mb-6 text-sm text-[#EB4C4C] bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] rounded-r-md px-4 py-3 font-semibold shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
            Role
          </label>

          <button
            type="button"
            onClick={() => setIsRoleOpen((prev) => !prev)}
            disabled={submitting}
            className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-left flex justify-between items-center"
          >
            <span className={role ? "text-[#1A1A1A] font-medium text-base" : "text-gray-400 font-medium text-base"}>
              {role || "Select Role"}
            </span>
            <span className="text-xs text-gray-400 font-bold ml-2">▼</span>
          </button>

          {isRoleOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#FFEDC7] rounded-md shadow-xl z-50 overflow-hidden">
              {["Student", "Faculty", "Company"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setIsRoleOpen(false);
                  }}
                  className="w-full text-left px-5 py-3.5 text-base font-bold text-gray-700 hover:bg-[#FFEDC7]/40 hover:text-[#EB4C4C] transition-colors duration-200"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button
          className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-base tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
          onClick={handleSignup}
          disabled={submitting}
        >
          {submitting ? "Signing up..." : "Signup"}
        </button>

        <div className="mt-8 text-center">
          <Link to="/login" className="group">
            <p className="text-sm font-semibold text-gray-500 transition-colors duration-200 group-hover:text-[#EB4C4C]">
              Already have an account? <span className="underline decoration-[#FFEDC7] group-hover:decoration-[#EB4C4C] underline-offset-4 transition-all">Login here</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;