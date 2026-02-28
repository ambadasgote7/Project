import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../../components/navbars/AdminNavBar";
import { BASE_URL } from "../../utils/constants";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-[#FFEDC7] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
      
      <h2 className="text-4xl font-bold text-[#1A1A1A] mt-3 tracking-tight">
        {value ?? "—"}
      </h2>
      
      {subtitle && (
        <p className="text-sm font-medium text-[#FF7070] mt-2">{subtitle}</p>
      )}
      
      <div className="mt-5 h-1.5 w-12 bg-[#EB4C4C] rounded-md" />
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-14">
    <h3 className="text-2xl font-bold mb-6 text-[#1A1A1A] tracking-tight border-b border-[#FFEDC7] pb-3">
      {title}
    </h3>
    {children}
  </div>
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/admin/dashboard`,
          { withCredentials: true }
        );
        setDashboard(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
      <AdminNavBar />

      <main className="w-full flex-grow px-6 py-12">
        <h2 className="text-4xl font-bold mb-12 text-[#1A1A1A] tracking-tight">
          Admin Dashboard
        </h2>

        {loading && (
          <div className="w-full bg-white p-8 rounded-md shadow-sm border border-[#FFEDC7] text-center">
            <p className="text-[#EB4C4C] font-semibold text-lg animate-pulse">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="w-full bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] text-[#EB4C4C] p-5 rounded-md font-semibold mb-8 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && dashboard && (
          <>
            <Section title="User Overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={dashboard.users.total}
                />
                <StatCard
                  title="Students"
                  value={dashboard.users.byRole.students}
                />
                <StatCard
                  title="Faculties"
                  value={dashboard.users.byRole.faculty}
                />
                <StatCard
                  title="Companies"
                  value={dashboard.users.byRole.companies}
                />
              </div>
            </Section>

            <Section title="User Health">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                  title="Unverified Users"
                  value={dashboard.users.unverified}
                  subtitle="Require admin action"
                />
                <StatCard
                  title="Revoked Users"
                  value={dashboard.users.revoked}
                />
                <StatCard
                  title="New Users (30 days)"
                  value={dashboard.users.new.last30Days}
                  subtitle={`${dashboard.users.new.last7Days} in last 7 days`}
                />
              </div>
            </Section>

            <Section title="Faculty Requests">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Pending Requests"
                  value={dashboard.facultyRequests.pending}
                />
                <StatCard
                  title="Approved Requests"
                  value={dashboard.facultyRequests.approved}
                />
                <StatCard
                  title="Rejected Requests"
                  value={dashboard.facultyRequests.rejected}
                />
                <StatCard
                  title="Approval Rate"
                  value={`${dashboard.facultyRequests.approvalRate}%`}
                  subtitle="Overall success"
                />
              </div>
            </Section>

            <Section title="Action Required">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard
                  title="Faculty Requests > 7 Days"
                  value={dashboard.alerts.pendingFacultyRequestsOver7Days}
                />
                <StatCard
                  title="Unverified Users > 7 Days"
                  value={dashboard.alerts.unverifiedUsersOver7Days}
                />
              </div>
            </Section>

            <Section title="Recent Activity">
              <div className="rounded-md shadow-sm border border-[#FFEDC7] overflow-hidden bg-white">
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
                          Status
                        </th>
                        <th className="px-6 py-5 text-left font-bold text-gray-600 tracking-wide uppercase text-xs">
                          Joined
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {dashboard.recentActivity.users.map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-[#FFEDC7]/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-5 font-medium text-[#1A1A1A]">
                            {u.email}
                          </td>

                          <td className="px-6 py-5 capitalize font-medium text-gray-600">
                            {u.role}
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
            </Section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;