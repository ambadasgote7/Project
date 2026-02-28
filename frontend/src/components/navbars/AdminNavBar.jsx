import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../../store/userSlice";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const AdminNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/api/admin/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  const showCore = true;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#FFEDC7] px-6 py-4 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 shadow-sm font-sans transition-all">
      
      <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight whitespace-nowrap">
        <span className="text-[#EB4C4C]">InternStatus</span> • Admin
      </h1>

      {showCore && (
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-sm font-medium text-gray-700">
          <Link
            to="/admin/dashboard"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Users
          </Link>

          <Link
            to="/admin/college-requests"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            College Requests
          </Link>

          <Link
            to="/admin/colleges"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Colleges
          </Link>

          <Link
            to="/admin/company-requests"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Company Requests
          </Link>

          <Link
            to="/admin/verified-company-requests"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Verified Companies
          </Link>

          <Link
            to="/admin/add-college"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Add College
          </Link>

          <Link
            to="/admin/colleges-list"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Colleges List
          </Link>

          <button
            onClick={handleLogout}
            className="ml-2 px-5 py-2.5 rounded-md bg-[#EB4C4C] text-white font-semibold hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar;