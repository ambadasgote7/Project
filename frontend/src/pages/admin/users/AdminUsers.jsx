import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

const ROLES = ["", "admin", "college", "faculty", "student", "company", "mentor"];
const STATUSES = ["", "active", "suspended", "deleted"];

const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  college: "bg-blue-100 text-blue-700 border-blue-200",
  faculty: "bg-indigo-100 text-indigo-700 border-indigo-200",
  student: "bg-emerald-100 text-emerald-700 border-emerald-200",
  company: "bg-amber-100 text-amber-700 border-amber-200",
  mentor: "bg-rose-100 text-rose-700 border-rose-200",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700 border-green-200",
  suspended: "bg-yellow-100 text-yellow-700 border-yellow-200",
  deleted: "bg-red-100 text-red-700 border-red-200",
};

function Badge({ value, map }) {
  const cls = map[value] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {value}
    </span>
  );
}

function Spinner({ size = 5 }) {
  return (
    <svg className={`animate-spin h-${size} w-${size} text-indigo-600`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    isVerified: "",
    isRegistered: "",
    page: 1,
    limit: 20,
  });
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v !== "") params[k] = v;
      });
      const { data } = await api.get("/admin/users", { params });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (err) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  const handleSearch = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: val, page: 1 }));
    }, 400);
  };

  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "status" }));
    try {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountStatus: newStatus } : u))
      );
      showToast(`User ${newStatus === "active" ? "activated" : "suspended"} successfully`);
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const handleResendInvite = async (userId, email) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "invite" }));
    try {
      await api.post(`/admin/users/${userId}/resend-invite`);
      showToast(`Invite sent to ${email}`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to send invite", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}>
          {toast.type === "error" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {pagination.total.toLocaleString()} total users across all roles
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by email..."
                onChange={handleSearch}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
            </div>

            {[
              { key: "role", options: ROLES, label: "All Roles" },
              { key: "status", options: STATUSES, label: "All Statuses" },
            ].map(({ key, options, label }) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => handleFilter(key, e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white capitalize"
              >
                {options.map((o) => (
                  <option key={o} value={o}>{o === "" ? label : o}</option>
                ))}
              </select>
            ))}

            <select
              value={filters.isVerified}
              onChange={(e) => handleFilter("isVerified", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Verified: All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={filters.isRegistered}
              onChange={(e) => handleFilter("isRegistered", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Registered: All</option>
              <option value="true">Registered</option>
              <option value="false">Pending Setup</option>
            </select>

            {Object.values(filters).some((v) => v !== "" && v !== 1 && v !== 20) && (
              <button
                onClick={() => {
                  setFilters({ search: "", role: "", status: "", isVerified: "", isRegistered: "", page: 1, limit: 20 });
                  if (searchRef.current) searchRef.current.value = "";
                }}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner size={8} />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Email", "Role", "Status", "Verified", "Registered", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge value={user.role} map={ROLE_COLORS} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge value={user.accountStatus} map={STATUS_COLORS} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.isVerified ? "text-green-600" : "text-gray-400"}`}>
                        {user.isVerified ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${user.isRegistered ? "text-green-600" : "text-amber-600"}`}>
                        {user.isRegistered ? "Complete" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Suspend / Activate */}
                        {user.accountStatus !== "deleted" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                user._id,
                                user.accountStatus === "active" ? "suspended" : "active"
                              )
                            }
                            disabled={actionLoading[user._id] === "status"}
                            className={`p-1.5 rounded-md transition-colors disabled:opacity-50
                              ${user.accountStatus === "active"
                                ? "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                              }`}
                            title={user.accountStatus === "active" ? "Suspend user" : "Activate user"}
                          >
                            {actionLoading[user._id] === "status" ? (
                              <Spinner size={4} />
                            ) : user.accountStatus === "active" ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                        )}

                        {/* Resend invite — only if not registered */}
                        {!user.isRegistered && user.accountStatus !== "deleted" && (
                          <button
                            onClick={() => handleResendInvite(user._id, user.email)}
                            disabled={actionLoading[user._id] === "invite"}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                            title="Resend invite"
                          >
                            {actionLoading[user._id] === "invite" ? (
                              <Spinner size={4} />
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * filters.limit) + 1}–{Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total.toLocaleString()} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    className={`w-8 h-8 text-sm rounded-lg font-medium ${p === pagination.page ? "bg-indigo-600 text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={!pagination.hasNext}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}