import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const Internships = () => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [appliedSet, setAppliedSet] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    mode: "",
    skill: "",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  const fetchInternships = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/internships`, {
        params: filters,
        withCredentials: true,
      });

      setInternships(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/application/student/applied`,
        { withCredentials: true }
      );

      const apps = res.data.data || [];

      const ids = new Set(
        apps.map((app) => app.internship?._id?.toString())
      );

      setAppliedSet(ids);

    } catch (err) {
      console.error("Applied fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInternships();
    fetchApplied();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const renderStipend = (internship) => {
    if (internship.stipendType === "paid") {
      return `₹${internship.stipendAmount}`;
    }
    if (internship.stipendType === "unpaid") {
      return "Unpaid";
    }
    return "Not Disclosed";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full">

        <div className="mb-10 border-b border-[#FFEDC7] pb-6 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Explore Internships
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Find your next career opportunity across top companies
          </p>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-[#FFEDC7] mb-10 grid grid-cols-1 md:grid-cols-4 gap-5">
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm"
          />

          <select
            name="mode"
            value={filters.mode}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm font-medium cursor-pointer"
          >
            <option value="">All Modes</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            name="skill"
            placeholder="Filter by skill..."
            value={filters.skill}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm"
          />

          <button
            onClick={fetchInternships}
            className="w-full bg-[#EB4C4C] text-white font-bold py-3 rounded-md shadow-sm hover:bg-[#FF7070] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 tracking-wide uppercase text-xs"
          >
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Scanning opportunities...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No internships found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship) => {
              const isApplied = appliedSet.has(
                internship._id.toString()
              );

              return (
                <div
                  key={internship._id}
                  className="group relative bg-white rounded-md border border-[#FFEDC7] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="p-6 md:p-8 flex-grow">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A] leading-tight group-hover:text-[#EB4C4C] transition-colors">
                          {internship.title}
                        </h2>
                        <p className="text-[#EB4C4C] font-semibold text-sm mt-1">
                          {internship.company?.companyName}
                        </p>
                      </div>
                      
                      {isApplied && (
                        <span className="shrink-0 bg-[#FFEDC7] text-[#EB4C4C] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-[#EB4C4C]/10">
                          Applied
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                        {internship.location || "Remote"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mode</p>
                        <p className="text-sm font-bold text-gray-700 capitalize">{internship.mode}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stipend</p>
                        <p className="text-sm font-bold text-gray-700">{renderStipend(internship)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 mt-auto">
                    <button
                      onClick={() =>
                        navigate(`/student/internships/${internship._id}`)
                      }
                      className="w-full bg-gray-50 text-[#1A1A1A] font-bold py-3 rounded-md border border-gray-200 hover:bg-[#EB4C4C] hover:text-white hover:border-[#EB4C4C] transition-all duration-200 text-sm tracking-wide"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-12 gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() =>
                setFilters({ ...filters, page: i + 1 })
              }
              className={`w-10 h-10 rounded-md font-bold text-sm transition-all duration-200 flex items-center justify-center border-2 ${
                filters.page === i + 1
                  ? "bg-[#EB4C4C] border-[#EB4C4C] text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-500 hover:border-[#FFEDC7] hover:bg-[#FFEDC7]/30"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Internships;