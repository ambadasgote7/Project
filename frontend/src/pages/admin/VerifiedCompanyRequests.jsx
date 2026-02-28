import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import AdminNavBar from "../../components/navbars/AdminNavBar";

const VerifiedCompanyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVerifiedCompanyRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/admin/verified-company-requests`,
        { withCredentials: true }
      );

      setRequests(res.data.verifiedRequests || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch verified company requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedCompanyRequests();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
      <AdminNavBar />

      <main className="w-full flex-grow px-6 py-12">
        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Verified Companies
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            List of approved and verified companies
          </p>
        </div>

        {loading && (
          <div className="w-full bg-white p-8 rounded-md shadow-sm border border-[#FFEDC7] text-center">
            <p className="text-[#EB4C4C] font-semibold text-lg animate-pulse">Loading verified companies...</p>
          </div>
        )}

        {error && (
          <div className="w-full bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] text-[#EB4C4C] p-5 rounded-md font-semibold mb-8 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No verified companies found
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-[#1A1A1A]">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Requester
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Company
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Document
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Verified At
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Verified By
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 align-middle">
                        <div className="font-bold text-[#1A1A1A] text-base">
                          {req.requesterName}
                        </div>
                        <div className="text-gray-500 text-sm mt-0.5 font-medium">
                          {req.requesterEmail}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-middle font-semibold text-gray-700">
                        {req.companyName}
                      </td>

                      <td className="px-6 py-5 align-middle">
                        {req.verificationDocumentUrl ? (
                          <a
                            href={req.verificationDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFEDC7] text-[#EB4C4C] font-bold text-xs hover:bg-[#FFA6A6]/40 transition-colors"
                          >
                            View Doc
                          </a>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 align-middle text-gray-500 font-medium">
                        {req.verifiedAt
                          ? new Date(req.verifiedAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-5 align-middle">
                        <span className="inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide bg-[#FFA6A6]/20 text-[#EB4C4C]">
                          {req.verifiedBy?.name || "Admin"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerifiedCompanyRequests;
