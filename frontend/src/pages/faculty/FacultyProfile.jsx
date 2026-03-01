import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/facultyProfile.css";

export default function FacultyProfile() {
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
      setLoading(true);
      const res = await API.get("/faculty/profile");
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
        fullName: profile.fullName || "",
        phoneNo: profile.phoneNo || "",
        designation: profile.designation || "",
        bio: profile.bio || ""
      };

      const res = await API.patch("/faculty/profile", payload);

      setProfile(res.data.data);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fp-page">
        <div className="fp-loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fp-page">
        <div className="fp-loading">No profile found.</div>
      </div>
    );
  }

  const initials = (profile.fullName || "F")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fp-page">
      <div className="fp-card">

        {/* Sidebar */}
        <aside className="fp-sidebar">
          <div className="fp-avatar">{initials}</div>
          <h2>{profile.fullName}</h2>
          <p>{profile.college?.name || "—"}</p>

          <div className="fp-meta">
            <p><strong>Employee ID:</strong> {profile.employeeId || "—"}</p>
            <p><strong>Joining Year:</strong> {profile.joiningYear || "—"}</p>
            <p><strong>Course:</strong> {profile.courseName || "—"}</p>
            <p><strong>specialization:</strong> {profile.department || "—"}</p>
          </div>
        </aside>

        {/* Main */}
        <main className="fp-main">
          <h1>Edit Profile</h1>

          {error && <div className="fp-error">{error}</div>}
          {success && <div className="fp-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              name="fullName"
              value={profile.fullName || ""}
              onChange={handleChange}
            />

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

            <label>Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={profile.bio || ""}
              onChange={handleChange}
            />

            <button
              type="submit"
              className={`fp-btn ${saving ? "fp-btn-loading" : ""}`}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="fp-spinner" />
                  Saving Changes...
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