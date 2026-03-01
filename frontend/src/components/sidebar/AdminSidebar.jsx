import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../../api/api";

export default function AdminSidebar() {

  const [counts, setCounts] = useState({
    all: 0,
    college: 0,
    company: 0
  });

  const fetchCounts = async () => {
    try {

      const res = await API.get("/admin/onboarding/pending?type=all");

      const colleges = res.data?.data?.colleges || [];
      const companies = res.data?.data?.companies || [];

      setCounts({
        all: colleges.length + companies.length,
        college: colleges.length,
        company: companies.length
      });

    } catch (err) {
      console.error("Sidebar count error:", err);
    }
  };

  useEffect(() => {
    fetchCounts();

    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);


  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }`;


  return (
    <div className="w-64 h-screen sticky top-0 bg-white border-r p-4 flex flex-col">

      <h2 className="text-xl font-semibold mb-6">
        Admin Panel
      </h2>

      <NavLink to="/admin" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/users" className={linkClass}>
        Users
      </NavLink>


      <NavLink
        to="/admin/onboarding/pending"
        className={linkClass}
      >
        <div className="flex justify-between items-center">
          <span>Pending Requests</span>

          {counts.all > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              {counts.all}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-1 ml-1">
          Colleges: {counts.college} | Companies: {counts.company}
        </div>
      </NavLink>


      <NavLink
        to="/admin/onboarding/verified"
        className={linkClass}
      >
        Verified Onboarding
      </NavLink>

      <NavLink
        to="/admin/colleges"
        className={linkClass}
      >
        Colleges
      </NavLink>

      <NavLink
        to="/admin/companies"
        className={linkClass}
      >
        Companies      
      </NavLink>

    </div>
  );
}