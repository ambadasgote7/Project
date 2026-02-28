import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect, useState } from "react";
import AdminNavBar from "../../components/navbars/AdminNavBar";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchColleges = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/college`,
        { withCredentials: true }
      );
      setColleges(res.data.colleges);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(search.toLowerCase()) ||
    college.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
        <AdminNavBar />
        <main className="w-full flex-grow px-6 py-12">
          <div className="w-full bg-white p-8 rounded-md shadow-sm border border-[#FFEDC7] text-center">
            <p className="text-[#EB4C4C] font-semibold text-lg animate-pulse">Loading colleges...</p>
          </div>
        </main>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
        <AdminNavBar />
        <main className="w-full flex-grow px-6 py-12">
          <div className="w-full bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] text-[#EB4C4C] p-5 rounded-md font-semibold shadow-sm">
            {error}
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
      <AdminNavBar />

      <main className="w-full flex-grow px-6 py-12">
        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Colleges
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            List of all registered colleges
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by college name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
          />
        </div>

        {filteredColleges.length === 0 ? (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No colleges found
          </div>
        ) : (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-[#1A1A1A]">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      College Name
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Location
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredColleges.map((college) => (
                    <tr
                      key={college._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-medium text-[#1A1A1A]">
                        {college.name}
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-medium">
                        {college.location}
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

export default Colleges;