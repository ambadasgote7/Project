import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInternship();
    checkApplied();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/internships/${id}`,
        { withCredentials: true }
      );
      setInternship(res.data.data);
    } catch (err) {
      setError("Failed to load internship");
    } finally {
      setLoading(false);
    }
  };

  const checkApplied = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/application/student/applied`,
        { withCredentials: true }
      );

      const applications = res.data.data || [];

      const found = applications.find(
        (app) => app.internship?._id?.toString() === id.toString()
      );

      if (found) {
        setApplied(true);
        setApplicationStatus(found.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);

      await axios.post(
        `${BASE_URL}/api/internships/${id}/apply`,
        {},
        { withCredentials: true }
      );

      setApplied(true);
      setApplicationStatus("applied");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Application failed"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading internship details...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans px-6 text-center">
        <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12">
          <p className="text-gray-500 font-bold text-lg mb-6">Internship not found.</p>
          <button 
            onClick={() => navigate(-1)}
            className="text-[#EB4C4C] font-bold uppercase tracking-wider text-sm hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stipend =
    internship.stipendType === "paid"
      ? `₹${internship.stipendAmount}`
      : internship.stipendType === "unpaid"
      ? "Unpaid"
      : "Not Disclosed";

  const statusColor = {
    applied: "bg-gray-100 text-gray-700",
    shortlisted: "bg-[#FFEDC7] text-[#1A1A1A]",
    interview: "bg-[#FFA6A6]/20 text-[#EB4C4C]",
    accepted: "bg-[#FFEDC7] text-[#EB4C4C]",
    rejected: "bg-[#FFA6A6]/10 text-[#EB4C4C] opacity-70",
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12 text-[#1A1A1A]">
      <div className="w-full max-w-4xl mx-auto space-y-8">

        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-[#EB4C4C] transition-all"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>

        <div className="bg-white border border-[#FFEDC7] rounded-md shadow-xl p-8 md:p-12 space-y-10 transition-all">

          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {internship.title}
              </h1>
              <p className="text-xl font-semibold text-gray-600">
                {internship.company?.companyName}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500">
                  {internship.location || "Remote"}
                </span>
                {applicationStatus && (
                  <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${statusColor[applicationStatus]}`}>
                    Status: {applicationStatus}
                  </span>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              {!applied ? (
                <button
                  disabled={applying}
                  onClick={handleApply}
                  className="w-full md:w-48 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-lg tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              ) : (
                <div className="w-full md:w-48 py-4 text-center rounded-md bg-[#FFEDC7] text-[#EB4C4C] font-bold text-lg border border-[#EB4C4C]/20 shadow-sm cursor-default">
                  Applied
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mode</p>
              <p className="text-lg font-bold capitalize">{internship.mode}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stipend</p>
              <p className="text-lg font-bold text-[#EB4C4C]">{stipend}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Positions</p>
              <p className="text-lg font-bold">{internship.positions}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</p>
              <p className="text-lg font-bold">
                {new Date(internship.applicationDeadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-l-4 border-[#EB4C4C] pl-4">
              Description
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-md">
              {internship.description}
            </p>
          </div>

          {internship.skillsRequired?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight border-l-4 border-[#EB4C4C] pl-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {internship.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest bg-[#FFEDC7] text-[#EB4C4C]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 rounded-md bg-[#FFA6A6]/20 text-[#EB4C4C] border-l-4 border-[#EB4C4C] text-sm font-bold shadow-sm">
              {error}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;