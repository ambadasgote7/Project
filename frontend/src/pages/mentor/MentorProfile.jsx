import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/mentorProfile.css";

export default function MentorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/mentor/profile");
      setProfile(res.data.data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        phoneNo: profile.phoneNo || "",
        designation: profile.designation || "",
        department: profile.department || "",
        bio: profile.bio || ""
      };

      const res = await API.patch("/mentor/profile", payload);

      setProfile(res.data.data);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mp-page">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="mp-page">No profile found</div>;
  }

  const initials = (profile.fullName || "M")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mp-page">
      <div className="mp-card">

        {/* Sidebar */}
        <aside className="mp-sidebar">
          <div className="mp-avatar">{initials}</div>

          <h2>{profile.fullName}</h2>
          <p>{profile.company?.name || "No Company Assigned"}</p>

          <span className={`mp-status ${profile.profileStatus}`}>
            {profile.profileStatus}
          </span>

          <div className="mp-meta">
            <p><strong>Employee ID:</strong> {profile.employeeId || "—"}</p>
          </div>
        </aside>

        {/* Main */}
        <main className="mp-main">
          <h1>Edit Profile</h1>

          {error && <div className="mp-error">{error}</div>}
          {success && <div className="mp-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            <label>Phone Number</label>
            <input
              name="phoneNo"
              value={profile.phoneNo || ""}
              onChange={handleChange}
            />

            <label>Designation</label>
            <input
              name="designation"
              value={profile.designation || ""}
              onChange={handleChange}
            />

            <label>Department</label>
            <input
              name="department"
              value={profile.department || ""}
              onChange={handleChange}
            />

            <label>Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={profile.bio || ""}
              onChange={handleChange}
            />

            <button
              type="submit"
              className={`mp-btn ${saving ? "mp-btn-loading" : ""}`}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="mp-spinner" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>

          </form>
        </main>

      </div>
    </div>
  );
}