import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#FFEDC7] shadow-sm font-sans transition-all">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#1A1A1A] whitespace-nowrap"
        >
          <span className="text-[#EB4C4C]">InternStatus</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4 text-sm font-medium text-gray-700">
          <Link
            to="/"
            className="px-4 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-md bg-[#EB4C4C] text-white font-semibold hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;