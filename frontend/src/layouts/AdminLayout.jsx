import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/navbars/AdminNavBar";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = () => (

  <div className="min-h-screen flex flex-col">

{/* TOP NAVBAR */}
<AdminNavBar />

{/* BODY */}
<div className="flex flex-1">

  {/* SIDEBAR */}
  <AdminSidebar />

  {/* MAIN CONTENT */}
  <main className="flex-1 p-6 bg-gray-50">
    <Outlet />
  </main>

</div>

  </div>
);

export default AdminLayout;
