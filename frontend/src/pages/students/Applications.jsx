import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/application/student/applied`,
        { withCredentials: true }
      );

      setApplications(res.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-gray-100 text-gray-700";
      case "shortlisted":
        return "bg-[#FFEDC7] text-[#1A1A1A]";
      case "interview":
        return "bg-[#FFA6A6]/20 text-[#EB4C4C]";
      case "accepted":
        return "bg-[#FFEDC7] text-[#EB4C4C]";
      case "rejected":
        return "bg-[#FFA6A6]/10 text-[#EB4C4C] opacity-70";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const renderStipend = (internship) => {
    if (!internship) return "N/A";
    if (internship.stipendType === "paid") {
      return `₹${internship.stipendAmount}`;
    }
    if (internship.stipendType === "unpaid") {
      return "Unpaid";
    }
    return "Not Disclosed";
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md bg-[#FFA6A6]/20 text-[#EB4C4C] border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-semibold shadow-sm text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12 text-[#1A1A1A]">
      <div className="w-full flex-grow">

        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            My Internship Applications
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Track your application progress and status updates
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            You haven’t applied to any internships yet.
          </div>
        ) : (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Internship</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Company</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Location</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Mode</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Stipend</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Applied On</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Mentor</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-bold text-[#1A1A1A] text-base whitespace-nowrap">
                        {app?.internship?.title || "N/A"}
                      </td>

                      <td className="px-6 py-5 font-semibold text-gray-700">
                        {app?.internship?.company?.companyName || "N/A"}
                      </td>

                      <td className="px-6 py-5 text-gray-600 font-medium">
                        {app?.internship?.location || "N/A"}
                      </td>

                      <td className="px-6 py-5 capitalize text-gray-600 font-medium">
                        {app?.internship?.mode || "N/A"}
                      </td>

                      <td className="px-6 py-5 font-bold text-[#EB4C4C]">
                        {renderStipend(app?.internship)}
                      </td>

                      <td className="px-6 py-5 text-gray-500 font-medium">
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="px-6 py-5 text-gray-500 font-medium italic">
                        {app?.mentor?.email || "Not Assigned"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
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

export default Applications;