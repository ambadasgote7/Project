import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const PostInternships = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    mode: "remote",
    location: "",
    skillsRequired: "",
    maxApplicants: 1,
    positions: 1,
    stipendType: "not_disclosed",
    stipendAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const deadline = new Date(formData.applicationDeadline);
    const now = new Date();

    if (!formData.title.trim()) return "Title required";
    if (!formData.description.trim()) return "Description required";
    if (end <= start) return "End date must be after start date";
    if (deadline >= start) return "Deadline must be before start date";
    if (deadline < now) return "Deadline cannot be in the past";

    if (formData.mode !== "remote" && !formData.location.trim())
      return "Location required for onsite or hybrid internships";

    if (formData.positions < 1) return "Positions must be at least 1";
    if (formData.maxApplicants < 1) return "Max applicants must be at least 1";

    const skills = formData.skillsRequired
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (skills.length === 0) return "At least one skill required";

    if (formData.stipendType === "paid") {
      if (!formData.stipendAmount || formData.stipendAmount < 0)
        return "Valid stipend amount required";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const skillsArray = formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const response = await axios.post(
        `${BASE_URL}/api/internships`,
        {
          ...formData,
          skillsRequired: skillsArray,
          maxApplicants: Number(formData.maxApplicants),
          positions: Number(formData.positions),
          stipendAmount:
            formData.stipendType === "paid"
              ? Number(formData.stipendAmount)
              : null,
        },
        { withCredentials: true }
      );

      setSuccess(response.data.message);

      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        applicationDeadline: "",
        mode: "remote",
        location: "",
        skillsRequired: "",
        maxApplicants: 1,
        positions: 1,
        stipendType: "not_disclosed",
        stipendAmount: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post internship"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-xl border border-[#FFEDC7] p-8 md:p-12 transition-all">

        <div className="text-center mb-10 border-b border-[#FFEDC7] pb-8">
          <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-3">
            Post Internship
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Create a new opportunity for students
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

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-6 border-b border-[#FFEDC7] pb-8">
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6">Core Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Internship Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Frontend Developer Intern"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and expectations..."
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base resize-y"
                required
              />
            </div>
          </div>

          <div className="space-y-6 border-b border-[#FFEDC7] pb-8">
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6">Timeline & Logistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  Work Mode
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base font-medium cursor-pointer"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {formData.mode !== "remote" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Pune, Maharashtra"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6">Requirements & Compensation</h3>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Skills Required (Comma separated)
              </label>
              <input
                type="text"
                name="skillsRequired"
                placeholder="e.g. React, Node.js, TypeScript"
                value={formData.skillsRequired}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  Total Positions
                </label>
                <input
                  type="number"
                  name="positions"
                  min="1"
                  value={formData.positions}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  Max Applicants Allowed
                </label>
                <input
                  type="number"
                  name="maxApplicants"
                  min="1"
                  value={formData.maxApplicants}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                  Stipend Type
                </label>
                <select
                  name="stipendType"
                  value={formData.stipendType}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base font-medium cursor-pointer"
                >
                  <option value="not_disclosed">Not Disclosed</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {formData.stipendType === "paid" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                    Stipend Amount (₹ per month)
                  </label>
                  <input
                    type="number"
                    name="stipendAmount"
                    placeholder="e.g. 15000"
                    min="0"
                    value={formData.stipendAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-[#FFEDC7] mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-lg tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
            >
              {loading ? "Posting..." : "Post Internship"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostInternships;