// File: src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar"; // create this

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Top Navbar */}
      <NavBar />

      {/* Body Section */}
      <div className="flex flex-1">

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default MainLayout;