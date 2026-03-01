import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";

// ─── Constants ───────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-700",
  college: "bg-blue-100 text-blue-700",
  faculty: "bg-indigo-100 text-indigo-700",
  student: "bg-emerald-100 text-emerald-700",
  company: "bg-amber-100 text-amber-700",
  mentor: "bg-rose-100 text-rose-700",
};
const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-yellow-100 text-yellow-700",
  deleted: "bg-red-100 text-red-700",
};
const APP_STATUS_COLORS = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-indigo-100 text-indigo-700",
  selected: "bg-violet-100 text-violet-700",
  offer_accepted: "bg-cyan-100 text-cyan-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
  ongoing: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  terminated: "bg-rose-100 text-rose-700",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Badge({ value, map, className = "" }) {
  const cls = (map && map[value]) || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls} ${className}`}>
      {value?.replace(/_/g, " ")}
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

function InfoRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-36 shrink-0 pt-0.5 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 break-words">{String(value)}</span>
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {action}
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
}

function StatCard({ label, value, accent = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    rose: "bg-rose-50 text-rose-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[accent]}`}>
      <p className="text-2xl font-bold">{value ?? "–"}</p>
      <p className="text-xs font-medium mt-0.5 opacity-75 capitalize">{label}</p>
    </div>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS_BY_ROLE = {
  student: ["Overview", "Profile", "Applications", "History", "Organization"],
  faculty: ["Overview", "Profile", "Employment", "Organization"],
  mentor: ["Overview", "Profile", "Employment", "Interns", "Organization"],
  college: ["Overview", "Profile", "Faculty", "Students"],
  company: ["Overview", "Profile", "Mentors", "Internships"],
  admin: ["Overview"],
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ user, profile, onClose, onSave }) {
  const FIELDS_BY_ROLE = {
    student: [
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "phoneNo", label: "Phone", type: "text" },
      { key: "courseName", label: "Course Name", type: "text" },
      { key: "specialization", label: "Specialization", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
    ],
    faculty: [
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "phoneNo", label: "Phone", type: "text" },
      { key: "employeeId", label: "Employee ID", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
    ],
    mentor: [
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "phoneNo", label: "Phone", type: "text" },
      { key: "employeeId", label: "Employee ID", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
    ],
    college: [
      { key: "name", label: "College Name", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "website", label: "Website", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    company: [
      { key: "name", label: "Company Name", type: "text" },
      { key: "website", label: "Website", type: "text" },
      { key: "industry", label: "Industry", type: "text" },
      { key: "companySize", label: "Company Size", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  };

  const fields = FIELDS_BY_ROLE[user.role] || [];
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = {};
    fields.forEach(({ key }) => {
      init[key] = profile?.[key] ?? "";
    });
    setForm(init);
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4 flex-1">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
              {type === "textarea" ? (
                <textarea
                  value={form[key] || ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={form[key] || ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Spinner size={4} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/${id}`);
      setData(res.data.data);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setActionLoading((p) => ({ ...p, status: true }));
    try {
      const res = await api.patch(`/admin/users/${id}/status`, { accountStatus: newStatus });
      setData((d) => ({ ...d, user: { ...d.user, accountStatus: newStatus } }));
      showToast(`User ${newStatus === "active" ? "activated" : "suspended"}`);
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading((p) => ({ ...p, status: false }));
    }
  };

  const handleResendInvite = async () => {
    setActionLoading((p) => ({ ...p, invite: true }));
    try {
      await api.post(`/admin/users/${id}/resend-invite`);
      showToast("Invite sent successfully");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed", "error");
    } finally {
      setActionLoading((p) => ({ ...p, invite: false }));
    }
  };

  const handleSaveProfile = async (form) => {
    try {
      await api.patch(`/admin/users/${id}/profile`, form);
      showToast("Profile updated");
      fetchUser();
    } catch {
      showToast("Update failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size={10} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        User not found
      </div>
    );
  }

  const { user, profile, organization, analytics, applications, history, related } = data;
  const tabs = TABS_BY_ROLE[user.role] || ["Overview"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          user={user}
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 py-5">
          {/* Back + breadcrumb */}
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {user.email[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">
                    {profile?.fullName || profile?.name || user.email}
                  </h1>
                  <Badge value={user.role} map={ROLE_COLORS} />
                  <Badge value={user.accountStatus} map={STATUS_COLORS} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>ID: {user._id}</span>
                  <span>•</span>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  {user.lastLoginAt && (
                    <>
                      <span>•</span>
                      <span>Last login {new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {!user.isRegistered && user.accountStatus !== "deleted" && (
                <button
                  onClick={handleResendInvite}
                  disabled={actionLoading.invite}
                  className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium flex items-center gap-2 disabled:opacity-60"
                >
                  {actionLoading.invite ? <Spinner size={4} /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  Resend Invite
                </button>
              )}

              {user.accountStatus !== "deleted" && (
                <>
                  {user.accountStatus === "active" ? (
                    <button
                      onClick={() => handleStatusChange("suspended")}
                      disabled={actionLoading.status}
                      className="px-4 py-2 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 font-medium flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading.status ? <Spinner size={4} /> : null}
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange("active")}
                      disabled={actionLoading.status}
                      className="px-4 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 font-medium flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading.status ? <Spinner size={4} /> : null}
                      Activate
                    </button>
                  )}
                </>
              )}

              {user.role !== "admin" && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-0.5 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === i
                    ? "bg-gray-50 text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* ─── OVERVIEW TAB ─────────────────────────────────────── */}
        {tabs[activeTab] === "Overview" && (
          <div className="space-y-5">
            {/* Analytics Grid */}
            {analytics && Object.keys(analytics).length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Analytics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {user.role === "student" && analytics && <>
                    <StatCard label="Total Applications" value={analytics.totalApplications} accent="indigo" />
                    <StatCard label="Shortlisted" value={analytics.shortlisted} accent="violet" />
                    <StatCard label="Selected" value={analytics.selected} accent="blue" />
                    <StatCard label="Ongoing" value={analytics.ongoing} accent="amber" />
                    <StatCard label="Completed" value={analytics.completed} accent="green" />
                    <StatCard label="Rejected" value={analytics.rejected} accent="red" />
                    <StatCard label="Withdrawn" value={analytics.withdrawn} accent="gray" />
                  </>}
                  {user.role === "faculty" && analytics && <>
                    <StatCard label="Students in College" value={analytics.studentsInCollege} accent="blue" />
                    <StatCard label="Faculty in College" value={analytics.facultyInCollege} accent="indigo" />
                  </>}
                  {user.role === "mentor" && analytics && <>
                    <StatCard label="Ongoing Interns" value={analytics.ongoingInterns} accent="amber" />
                    <StatCard label="Completed Interns" value={analytics.completedInterns} accent="green" />
                    <StatCard label="Total Interns" value={analytics.totalInterns} accent="indigo" />
                  </>}
                  {user.role === "college" && analytics && <>
                    <StatCard label="Total Faculty" value={analytics.totalFaculty} accent="indigo" />
                    <StatCard label="Active Faculty" value={analytics.activeFaculty} accent="green" />
                    <StatCard label="Total Students" value={analytics.totalStudents} accent="blue" />
                    <StatCard label="Active Students" value={analytics.activeStudents} accent="green" />
                  </>}
                  {user.role === "company" && analytics && <>
                    <StatCard label="Total Internships" value={analytics.totalInternships} accent="indigo" />
                    <StatCard label="Open" value={analytics.openInternships} accent="green" />
                    <StatCard label="Mentors" value={analytics.totalMentors} accent="rose" />
                    <StatCard label="Ongoing Interns" value={analytics.ongoingInterns} accent="amber" />
                    <StatCard label="Completed" value={analytics.completedInterns} accent="blue" />
                  </>}
                </div>
              </div>
            )}

            {/* Account Summary */}
            <Section title="Account Details">
              <InfoRow label="User ID" value={user._id} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Account Status" value={user.accountStatus} />
              <InfoRow label="Verified" value={user.isVerified ? "Yes" : "No"} />
              <InfoRow label="Registered" value={user.isRegistered ? "Yes" : "Pending Setup"} />
              <InfoRow label="Reference Model" value={user.referenceModel} />
              <InfoRow label="Created At" value={new Date(user.createdAt).toLocaleString("en-IN")} />
              {user.lastLoginAt && <InfoRow label="Last Login" value={new Date(user.lastLoginAt).toLocaleString("en-IN")} />}
            </Section>
          </div>
        )}

        {/* ─── PROFILE TAB ──────────────────────────────────────── */}
        {tabs[activeTab] === "Profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Section title="Profile Information">
              {profile ? (
                <>
                  {["fullName", "name"].map((k) => profile[k] && <InfoRow key={k} label="Name" value={profile[k]} />)}
                  <InfoRow label="Designation" value={profile.designation} />
                  <InfoRow label="Department" value={profile.department} />
                  <InfoRow label="Phone" value={profile.phoneNo || profile.phone} />
                  <InfoRow label="Bio" value={profile.bio} />
                  <InfoRow label="Employee ID" value={profile.employeeId} />
                  <InfoRow label="PRN" value={profile.prn} />
                  <InfoRow label="Course" value={profile.courseName} />
                  <InfoRow label="Specialization" value={profile.specialization} />
                  <InfoRow label="Joining Year" value={profile.joiningYear} />
                  <InfoRow label="Profile Status" value={profile.profileStatus} />
                  <InfoRow label="Status" value={profile.status} />
                  {profile.website && <InfoRow label="Website" value={profile.website} />}
                  {profile.industry && <InfoRow label="Industry" value={profile.industry} />}
                  {profile.companySize && <InfoRow label="Company Size" value={profile.companySize} />}
                  {profile.address && <InfoRow label="Address" value={profile.address} />}
                  {profile.description && <InfoRow label="Description" value={profile.description} />}
                  {profile.skills?.length > 0 && (
                    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50">
                      <span className="text-xs text-gray-400 w-36 shrink-0 pt-0.5 font-medium uppercase tracking-wide">Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="py-4 text-sm text-gray-400 text-center">No profile data</p>
              )}
            </Section>

            {/* Courses for college */}
            {user.role === "college" && profile?.courses?.length > 0 && (
              <Section title="Offered Courses">
                <div className="space-y-3 py-2">
                  {profile.courses.map((c, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.durationYears} years</p>
                      {c.specializations?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {c.specializations.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Company locations */}
            {(user.role === "company" || user.role === "mentor") && organization?.locations?.length > 0 && (
              <Section title="Locations">
                <div className="py-2 space-y-2">
                  {organization.locations.map((l, i) => (
                    <div key={i} className="text-sm text-gray-700">{[l.city, l.state, l.country].filter(Boolean).join(", ")}</div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ─── APPLICATIONS TAB (Student) ───────────────────────── */}
        {tabs[activeTab] === "Applications" && (
          <div className="space-y-3">
            {applications?.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                <p className="font-medium">No applications yet</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm">{app.internship?.title}</h3>
                        <Badge value={app.status} map={APP_STATUS_COLORS} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{app.company?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        {app.internship?.mode && <span className="capitalize">{app.internship.mode}</span>}
                        {app.internship?.durationMonths && <span>{app.internship.durationMonths} months</span>}
                        {app.internship?.stipendType && <span className="capitalize">{app.internship.stipendType}</span>}
                        {app.internship?.stipendAmount && <span>₹{app.internship.stipendAmount.toLocaleString()}/mo</span>}
                      </div>
                      {app.mentor && (
                        <p className="text-xs text-gray-400 mt-1">Mentor: {app.mentor.fullName}</p>
                      )}
                      {app.faculty && (
                        <p className="text-xs text-gray-400">Faculty: {app.faculty.fullName}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-400 space-y-1">
                      {app.internshipStartDate && <p>Start: {new Date(app.internshipStartDate).toLocaleDateString("en-IN")}</p>}
                      {app.internshipEndDate && <p>End: {new Date(app.internshipEndDate).toLocaleDateString("en-IN")}</p>}
                      {app.evaluationScore != null && (
                        <p className="font-semibold text-gray-700">Score: {app.evaluationScore}/100</p>
                      )}
                    </div>
                  </div>
                  {(app.mentorFeedback || app.facultyFeedback) && (
                    <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
                      {app.mentorFeedback && <p className="text-xs text-gray-500"><span className="font-medium">Mentor:</span> {app.mentorFeedback}</p>}
                      {app.facultyFeedback && <p className="text-xs text-gray-500"><span className="font-medium">Faculty:</span> {app.facultyFeedback}</p>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── HISTORY TAB (Student academic) ──────────────────── */}
        {tabs[activeTab] === "History" && (
          <div className="space-y-3">
            {history?.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                <p className="font-medium">No academic history</p>
              </div>
            ) : (
              history.map((h) => (
                <div key={h._id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{h.college?.name}</h3>
                    <Badge value={h.status} map={{ active: "bg-green-100 text-green-700", ended: "bg-gray-100 text-gray-600" }} />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 space-y-1">
                    {h.courseName && <p>{h.courseName}{h.specialization ? ` — ${h.specialization}` : ""}</p>}
                    <p>{new Date(h.startDate).toLocaleDateString("en-IN")} → {h.endDate ? new Date(h.endDate).toLocaleDateString("en-IN") : "Present"}</p>
                    {h.college?.address && <p>{h.college.address}</p>}
                    {h.remarks && <p className="italic">{h.remarks}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── EMPLOYMENT TAB (Faculty / Mentor) ───────────────── */}
        {tabs[activeTab] === "Employment" && (
          <div className="space-y-3">
            {history?.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                <p className="font-medium">No employment history</p>
              </div>
            ) : (
              history.map((h) => (
                <div key={h._id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {h.college?.name || h.company?.name}
                      </h3>
                      {(h.designation || h.department) && (
                        <p className="text-sm text-gray-500 mt-0.5">{[h.designation, h.department].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                    <Badge value={h.status} map={{ active: "bg-green-100 text-green-700", ended: "bg-gray-100 text-gray-600" }} />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 space-y-1">
                    {h.courseName && <p>{h.courseName}{h.specialization ? ` — ${h.specialization}` : ""}</p>}
                    <p>{new Date(h.startDate).toLocaleDateString("en-IN")} → {h.endDate ? new Date(h.endDate).toLocaleDateString("en-IN") : "Present"}</p>
                    {h.remarks && <p className="italic">{h.remarks}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── ORGANIZATION TAB ─────────────────────────────────── */}
        {tabs[activeTab] === "Organization" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {organization ? (
              <Section title={user.role === "student" || user.role === "faculty" ? "College" : "Company"}>
                <InfoRow label="Name" value={organization.name} />
                <InfoRow label="Website" value={organization.website} />
                <InfoRow label="Email Domain" value={organization.emailDomain} />
                <InfoRow label="Industry" value={organization.industry} />
                <InfoRow label="Address" value={organization.address} />
                {organization.locations?.map((l, i) => (
                  <InfoRow key={i} label={`Location ${i + 1}`} value={[l.city, l.state, l.country].filter(Boolean).join(", ")} />
                ))}
                <InfoRow label="Status" value={organization.status} />
              </Section>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                <p>Not assigned to any organization</p>
              </div>
            )}
          </div>
        )}

        {/* ─── INTERNS TAB (Mentor) ─────────────────────────────── */}
        {tabs[activeTab] === "Interns" && (
          <div className="space-y-3">
            {applications?.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                <p className="font-medium">No interns assigned</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {app.studentSnapshot?.fullName || app.student?.fullName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.studentSnapshot?.collegeName} · {app.studentSnapshot?.courseName}</p>
                      <p className="text-sm text-gray-600 mt-1">{app.internship?.title}</p>
                    </div>
                    <Badge value={app.status} map={APP_STATUS_COLORS} />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    {app.internshipStartDate && <span>Start: {new Date(app.internshipStartDate).toLocaleDateString("en-IN")}</span>}
                    {app.internshipEndDate && <span>End: {new Date(app.internshipEndDate).toLocaleDateString("en-IN")}</span>}
                    {app.evaluationScore != null && <span className="text-gray-700 font-medium">Score: {app.evaluationScore}/100</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── FACULTY TAB (College) ────────────────────────────── */}
        {tabs[activeTab] === "Faculty" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {!related?.faculty?.length ? (
              <div className="py-16 text-center text-gray-400 text-sm">No faculty members found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Name", "Designation", "Department", "Emp ID", "Status", "Profile", "Account"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {related.faculty.map((f) => (
                    <tr key={f._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{f.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">{f.designation || "–"}</td>
                      <td className="px-4 py-3 text-gray-500">{f.department || "–"}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{f.employeeId || "–"}</td>
                      <td className="px-4 py-3"><Badge value={f.status} map={{ active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-600", unassigned: "bg-amber-100 text-amber-700" }} /></td>
                      <td className="px-4 py-3"><Badge value={f.profileStatus} map={{ completed: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700" }} /></td>
                      <td className="px-4 py-3"><Badge value={f.user?.accountStatus} map={STATUS_COLORS} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ─── STUDENTS TAB (College) ───────────────────────────── */}
        {tabs[activeTab] === "Students" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {!related?.students?.length ? (
              <div className="py-16 text-center text-gray-400 text-sm">No students found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Name", "PRN", "Course", "Specialization", "Status", "Profile"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {related.students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.fullName}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.prn || "–"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.courseName || "–"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.specialization || "–"}</td>
                      <td className="px-4 py-3"><Badge value={s.status} map={{ active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-600", graduated: "bg-blue-100 text-blue-700", unassigned: "bg-amber-100 text-amber-700" }} /></td>
                      <td className="px-4 py-3"><Badge value={s.profileStatus} map={{ completed: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ─── MENTORS TAB (Company) ────────────────────────────── */}
        {tabs[activeTab] === "Mentors" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {!related?.mentors?.length ? (
              <div className="py-16 text-center text-gray-400 text-sm">No mentors found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Name", "Designation", "Department", "Emp ID", "Status", "Account"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {related.mentors.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{m.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">{m.designation || "–"}</td>
                      <td className="px-4 py-3 text-gray-500">{m.department || "–"}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{m.employeeId || "–"}</td>
                      <td className="px-4 py-3"><Badge value={m.status} map={{ active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-600", unassigned: "bg-amber-100 text-amber-700" }} /></td>
                      <td className="px-4 py-3"><Badge value={m.user?.accountStatus} map={STATUS_COLORS} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ─── INTERNSHIPS TAB (Company) ────────────────────────── */}
        {tabs[activeTab] === "Internships" && (
          <div className="space-y-3">
            {!related?.internships?.length ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400 text-sm">No internships posted</div>
            ) : (
              related.internships.map((i) => (
                <div key={i._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm">{i.title}</h3>
                        <Badge value={i.status} map={{ open: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600" }} />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                        {i.mode && <span className="capitalize">{i.mode}</span>}
                        {i.durationMonths && <span>{i.durationMonths} months</span>}
                        {i.stipendType && <span className="capitalize">{i.stipendType}</span>}
                        {i.stipendAmount && <span>₹{i.stipendAmount.toLocaleString()}/mo</span>}
                        {i.positions && <span>{i.positions} positions</span>}
                        {i.applicationDeadline && <span>Deadline: {new Date(i.applicationDeadline).toLocaleDateString("en-IN")}</span>}
                      </div>
                      {i.skillsRequired?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {i.skillsRequired.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{i.applicantCount}</p>
                      <p className="text-xs text-gray-400">applicants</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}