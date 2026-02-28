import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const InternshipHiringPage = () => {
  const { id } = useParams();

  const [internship, setInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, [page, statusFilter]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/application/internship/${id}/applicants`,
        {
          params: { page, status: statusFilter, search },
          withCredentials: true,
        }
      );

      setInternship(res.data.internship);
      setApplicants(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      alert("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/application/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      const updated = res.data.data;

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === updated._id ? updated : app
        )
      );
    } catch (err) {
      alert("Status update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading applicants...</p>
      </div>
    );

  if (!internship)
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans">
        <p className="text-gray-500 font-bold text-lg">No data found.</p>
      </div>
    );

  const acceptedCount = applicants.filter(
    (a) => a.status === "accepted"
  ).length;

  const positionsFilled =
    acceptedCount >= internship.positions;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full">
        
        <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] mb-1">
              {internship.title}
            </h1>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Applicant Review Dashboard
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-gray-50 px-6 py-4 rounded-md border border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</span>
              <span className="text-[#1A1A1A] font-bold capitalize">{internship.status}</span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Positions Filled</span>
              <span className="text-[#EB4C4C] font-bold">
                {acceptedCount} <span className="text-gray-400">/</span> {internship.positions}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-6 mb-8 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow md:max-w-xs px-4 py-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm font-medium"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="flex-grow md:max-w-xs px-4 py-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm font-medium cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => {
              setPage(1);
              fetchApplicants();
            }}
            className="px-6 py-3 rounded-md bg-[#EB4C4C] text-white font-bold text-sm tracking-wide hover:bg-[#FF7070] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>

        <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-[#1A1A1A]">
              <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                <tr>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Name</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Email</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Course</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Year</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs min-w-[200px]">Skills</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Resume</th>
                  <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Status</th>
                  <th className="px-6 py-5 text-right font-bold text-gray-600 tracking-wide uppercase text-xs">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {applicants.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-5 align-middle font-bold text-[#1A1A1A] text-base whitespace-nowrap">
                      {app.student?.userId?.fullName}
                    </td>

                    <td className="px-6 py-5 align-middle font-medium text-gray-600">
                      {app.student?.userId?.email}
                    </td>

                    <td className="px-6 py-5 align-middle text-gray-600 font-medium">
                      {app.student?.course}
                    </td>

                    <td className="px-6 py-5 align-middle text-gray-600 font-medium">
                      {app.student?.year}
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <div className="flex flex-wrap gap-2">
                        {app.student?.skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wide text-[10px] px-2.5 py-1.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle">
                      {app.student?.resumeFileUrl ? (
                        <a
                          href={app.student.resumeFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFEDC7] text-[#EB4C4C] font-bold text-xs hover:bg-[#FFA6A6]/40 transition-colors"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 font-medium italic text-xs">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <span className="inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide bg-[#FFEDC7] text-[#EB4C4C]">
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 align-middle text-right whitespace-nowrap space-x-2">
                      {app.status === "applied" && (
                        <>
                          <button
                            disabled={internship.status !== "open"}
                            onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md bg-[#EB4C4C] text-white hover:bg-[#FF7070] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          >
                            Shortlist
                          </button>
                          <button
                            disabled={internship.status !== "open"}
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "shortlisted" && (
                        <>
                          <button
                            disabled={internship.status !== "open"}
                            onClick={() => handleStatusUpdate(app._id, "interview")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md bg-[#EB4C4C] text-white hover:bg-[#FF7070] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          >
                            Interview
                          </button>
                          <button
                            disabled={internship.status !== "open"}
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "interview" && (
                        <>
                          <button
                            disabled={internship.status !== "open" || positionsFilled}
                            onClick={() => handleStatusUpdate(app._id, "accepted")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md bg-[#EB4C4C] text-white hover:bg-[#FF7070] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          >
                            Accept
                          </button>
                          <button
                            disabled={internship.status !== "open"}
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="px-4 py-2 text-xs font-bold tracking-wide rounded-md border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(app.status === "accepted" || app.status === "rejected") && (
                        <span className="inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-400">
                          Finalized
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2.5 rounded-md border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Page {meta.page || 1} of {meta.pages || 1}
          </span>

          <button
            disabled={page === meta.pages || !meta.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2.5 rounded-md border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default InternshipHiringPage;