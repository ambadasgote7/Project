import { NavLink } from "react-router-dom";

export default function Sidebar() {

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 border-r bg-white p-4">

      <h2 className="text-lg font-semibold mb-4">
        Menu
      </h2>

      <NavLink to="/" className={linkClass}>
        Home
      </NavLink>

      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/profile" className={linkClass}>
        Profile
      </NavLink>

    </div>
  );
}