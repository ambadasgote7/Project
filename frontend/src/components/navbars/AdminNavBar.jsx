import { BASE_URL } from "../../utils/constants";

const AdminNavBar = () => {
  


  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#FFEDC7] px-6 py-4 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 shadow-sm font-sans transition-all">
      
      <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight whitespace-nowrap">
        <span className="text-[#EB4C4C]">InternStatus</span> • Admin
      </h1>

    </nav>
  );
};

export default AdminNavBar;