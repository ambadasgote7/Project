import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminNavBar from "../../components/navbars/AdminNavBar";
import { BASE_URL } from "../../utils/constants";

const roleBadge = {
  student: "bg-[#FFEDC7] text-[#EB4C4C]",
  faculty: "bg-[#FFA6A6]/40 text-[#EB4C4C]",
  company: "bg-gray-100 text-gray-700",
  admin: "bg-[#EB4C4C] text-white",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/users`,
          { withCredentials: true }
        );
        setUsers(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((u) => {
      const userRole = u.role?.toLowerCase().trim();

      const searchableText = `
        ${u.email}
        ${u.role}
        ${u.roleStatus}
        ${u.isVerified ? "verified" : "not verified"}
      `.toLowerCase();

      const matchSearch = searchableText.includes(q);

      const matchRole =
        roleFilter === "all" || userRole === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
      <AdminNavBar />

      <main className="w-full flex-grow px-6 py-12">
        <div className="mb-10 border-b border-[#FFEDC7] pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            User Management
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            View, filter, and manage all platform accounts
          </p>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-[#FFEDC7] mb-10 flex flex-col md:flex-row gap-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, role, status, verified..."
            className="w-full md:w-2/3 px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base font-medium cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading && (
          <div className="w-full bg-white p-8 rounded-md shadow-sm border border-[#FFEDC7] text-center">
            <p className="text-[#EB4C4C] font-semibold text-lg animate-pulse">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="w-full bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] text-[#EB4C4C] p-5 rounded-md font-semibold mb-8 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-[#1A1A1A]">
                <thead className="bg-gray-50/80 border-b border-[#FFEDC7]">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Email
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Role
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Verified
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500 font-medium text-lg"
                      >
                        No users found
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-bold text-[#1A1A1A] text-base">
                        {u.email}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide ${
                            roleBadge[u.role] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {u.isVerified ? (
                          <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#FFEDC7] text-[#EB4C4C]">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-gray-100 text-gray-500">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 font-bold text-gray-600 capitalize">
                        {u.roleStatus}
                      </td>

                      <td className="px-6 py-5 text-gray-500 font-medium">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;