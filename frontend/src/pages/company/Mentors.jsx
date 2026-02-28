import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const Mentors = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/mentor/company`,
        { withCredentials: true }
      );

      setMentors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#FFEDC7] pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
              Company Mentors
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Manage your registered internship mentors
            </p>
          </div>

          <button
            onClick={() => navigate("/company/add-mentor")}
            className="px-6 py-3 rounded-md bg-[#EB4C4C] text-white font-bold text-base tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            + Add Mentor
          </button>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-[#FFEDC7] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-[#EB4C4C] font-semibold text-lg animate-pulse">Loading mentors...</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium text-lg">
              No mentors added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-[#1A1A1A]">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Name</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Email</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Department</th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {mentors.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 align-middle font-bold text-[#1A1A1A] text-base whitespace-nowrap">
                        {m.name}
                      </td>

                      <td className="px-6 py-5 align-middle font-medium text-gray-600">
                        {m.userId?.email}
                      </td>

                      <td className="px-6 py-5 align-middle text-gray-600 font-medium">
                        {m.department || "—"}
                      </td>

                      <td className="px-6 py-5 align-middle">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide ${
                            m.status === "active"
                              ? "bg-[#FFEDC7] text-[#EB4C4C]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentors;