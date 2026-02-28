import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/userSlice";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { clearStudentProfile } from "../../store/studentProfileSlice";

const CompanyNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user?.user) || {};

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/api/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(clearStudentProfile());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const showRegister = !user.isRegistered;
  const showPending = user.isRegistered && !user.isVerified;
  const showCore = user.isRegistered && user.isVerified;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#FFEDC7] shadow-sm font-sans transition-all">
      <div className="w-full px-6 py-4 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-sm font-medium text-gray-700">
          
          <Link
            to="/company/dashboard"
            className="text-2xl font-bold tracking-tight text-[#1A1A1A] mr-4 whitespace-nowrap"
          >
            <span className="text-[#EB4C4C]">InternStatus</span> 
            <span className="text-gray-500 font-medium text-lg ml-1">(Company)</span>
          </Link>

          {showCore && (
            <>
              <Link
                to="/company/invite-mentor"
                className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
              >
                Add Mentor
              </Link>

              <Link
                to="/company/internships"
                className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
              >
                Post Internships
              </Link>

              <Link
                to="/company/postings"
                className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
              >
                View Postings
              </Link>

              <Link
                to="/company/mentors"
                className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
              >
                Mentor List
              </Link>
            </>
          )}

          {showPending && (
            <Link
              to="/pending-verification"
              className="px-3 py-2 rounded-md text-[#FFA6A6] font-semibold hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/20 transition-all duration-200"
            >
              Verification Pending
            </Link>
          )}

          {showRegister && (
            <Link
              to="/company/register"
              className="px-3 py-2 rounded-md text-[#EB4C4C] font-semibold hover:text-[#FF7070] hover:bg-[#FFEDC7]/40 transition-all duration-200"
            >
              Complete Registration
            </Link>
          )}
        </div>

        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-md bg-[#EB4C4C] text-white font-semibold hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavBar;