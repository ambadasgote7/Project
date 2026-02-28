import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const ViewPostings = () => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/internships/company/internships`,
        { withCredentials: true }
      );

      setInternships(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/internships/company/internships/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      const updated = res.data.data;

      setInternships((prev) =>
        prev.map((item) =>
          item._id === updated._id ? updated : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  const getStipendDisplay = (internship) => {
    if (internship.stipendType === "paid") {
      return `₹${internship.stipendAmount}`;
    }
    if (internship.stipendType === "unpaid") {
      return "Unpaid";
    }
    return "Not Disclosed";
  };

  if (loading)
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading postings...</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full max-w-6xl mx-auto flex-grow">
        
        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Your Internship Postings
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Manage your active and past internship listings
          </p>
        </div>

        {internships.length === 0 && (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No internships posted yet.
          </div>
        )}

        <div className="space-y-6">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-6 md:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
                    {internship.title}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Mode</span>
                      <span className="text-sm font-bold text-gray-700 capitalize">{internship.mode}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Stipend</span>
                      <span className="text-sm font-bold text-[#EB4C4C]">{getStipendDisplay(internship)}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Deadline</span>
                      <span className="text-sm font-bold text-gray-700">
                        {new Date(internship.applicationDeadline).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Positions</span>
                      <span className="text-sm font-bold text-gray-700">{internship.positions}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end justify-start">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Current Status</span>
                  <span className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide bg-[#FFEDC7] text-[#EB4C4C]">
                    {internship.status}
                  </span>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-6">
                
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Change Status
                  </label>
                  <select
                    value={internship.status}
                    disabled={internship.status === "completed"}
                    onChange={(e) =>
                      handleStatusChange(internship._id, e.target.value)
                    }
                    className="w-full sm:w-48 px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    navigate(`/company/internship/${internship._id}`)
                  }
                  className="w-full sm:w-auto bg-[#EB4C4C] text-white px-6 py-3 rounded-md text-sm font-bold tracking-wide hover:bg-[#FF7070] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  View Applicants
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPostings;