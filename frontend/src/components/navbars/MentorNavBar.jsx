const MentorNavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#FFEDC7] shadow-sm font-sans transition-all">
      <div className="w-full px-6 py-4 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-sm font-medium text-gray-700">
          
          <Link
            to="/mentor"
            className="text-2xl font-bold tracking-tight text-[#1A1A1A] mr-4 whitespace-nowrap"
          >
            <span className="text-[#EB4C4C]">InternStatus</span> 
            <span className="text-gray-500 font-medium text-lg ml-1">(Mentor)</span>
          </Link>

          <Link
            to="/mentor/dashboard"
            className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"
          >
            Dashboard
          </Link>

          <Link to="/mentor/dashboard" className="px-3 py-2 rounded-md hover:text-[#EB4C4C] hover:bg-[#FFEDC7]/40 transition-all duration-200"> 
            Add Mentor  
          </Link>
        </div>

        <div className="flex items-center">
          <button
            onClick={"handleLogout"}
            className="px-5 py-2.5 rounded-md bg-[#EB4C4C] text-white font-semibold hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MentorNavBar;    