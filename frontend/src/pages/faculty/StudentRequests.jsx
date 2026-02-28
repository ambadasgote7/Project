import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const StudentRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/faculty/pending-student-requests`,
        { withCredentials: true }
      );
      setStudents(res.data.pendingRequests || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load student requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      setActionLoading(id);

      await axios.post(
        `${BASE_URL}/api/faculty/student/${id}/${status}`,
        {},
        { withCredentials: true }
      );

      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex justify-center items-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading student requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex justify-center items-center px-6 font-sans">
        <div className="w-full max-w-md bg-[#FFA6A6]/20 text-[#EB4C4C] border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-semibold shadow-sm text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full flex-grow">

        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Pending Student Requests
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Review and verify student registrations for your institution
          </p>
        </div>

        {students.length === 0 ? (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No pending requests found.
          </div>
        ) : (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-[#1A1A1A]">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Name</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">PRN</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">College</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Course</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Year</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Documents</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Submitted</th>
                    <th className="px-6 py-5 text-right font-bold text-gray-600 tracking-wide uppercase text-xs">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 align-middle font-bold text-[#1A1A1A] text-base whitespace-nowrap">
                        {s.fullName}
                      </td>
                      <td className="px-6 py-5 align-middle font-medium text-gray-600">
                        {s.prn}
                      </td>
                      <td className="px-6 py-5 align-middle font-semibold text-gray-700 min-w-[200px]">
                        {s.college?.name || "—"}
                      </td>
                      <td className="px-6 py-5 align-middle text-gray-600 font-medium">
                        {s.course}
                      </td>
                      <td className="px-6 py-5 align-middle text-gray-600 font-medium">
                        {s.year}
                      </td>

                      <td className="px-6 py-5 align-middle">
                        <div className="flex flex-col gap-2">
                          {s.collegeIdImageUrl && (
                            <a
                              href={s.collegeIdImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#FFEDC7] text-[#EB4C4C] font-bold text-xs hover:bg-[#FFA6A6]/40 transition-colors w-max"
                            >
                              College ID
                            </a>
                          )}
                          {s.resumeFileUrl && (
                            <a
                              href={s.resumeFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 transition-colors w-max"
                            >
                              Resume
                            </a>
                          )}
                          {!s.collegeIdImageUrl && !s.resumeFileUrl && (
                             <span className="text-gray-400 font-medium italic text-xs">N/A</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-middle text-gray-500 font-medium">
                        {new Date(s.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="px-6 py-5 align-middle text-right whitespace-nowrap space-x-2">
                        <button
                          disabled={actionLoading === s._id}
                          onClick={() => updateRequestStatus(s._id, "approved")}
                          className="px-4 py-2 rounded-md bg-[#EB4C4C] text-white text-xs font-bold tracking-wide hover:bg-[#FF7070] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                        >
                          Approve
                        </button>

                        <button
                          disabled={actionLoading === s._id}
                          onClick={() => updateRequestStatus(s._id, "rejected")}
                          className="px-4 py-2 rounded-md border-2 border-gray-200 text-gray-600 text-xs font-bold tracking-wide hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRequests;