import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const SetMentorPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!password || !confirmPassword) {
      return "All fields are required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/mentor/set-password`,
        {
          token,
          password,
        }
      );

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to set password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-md shadow-xl border border-[#FFEDC7] p-8 md:p-10 text-center transition-all">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] mb-4">
            Access Denied
          </h2>
          <div className="text-sm text-[#EB4C4C] bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-semibold shadow-sm">
            Invalid or missing security token
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-md shadow-xl border border-[#FFEDC7] p-8 md:p-10 transition-all">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Create Password
          </h2>
          <p className="text-gray-500 font-medium text-base mt-2">
            Secure your mentor account
          </p>
        </div>

        {error && (
          <div className="mb-8 text-sm text-[#EB4C4C] bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-semibold shadow-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 text-sm text-[#1A1A1A] bg-[#FFEDC7] border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-bold shadow-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter at least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Retype your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-base tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SetMentorPassword;