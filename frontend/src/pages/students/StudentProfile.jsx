import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import "../../styles/studentProfile.css";

export default function StudentProfile() {

  const [profile, setProfile] = useState(null);
  const [skillsInput, setSkillsInput] = useState(""); // 🔥 separate input state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/student/profile");

      let data = res.data.data;

      // 🔥 Ensure skills is always array
      if (typeof data.skills === "string") {
        try {
          data.skills = JSON.parse(data.skills);
        } catch {
          data.skills = [];
        }
      }

      setProfile(data);
      setSkillsInput((data.skills || []).join(", ")); // 🔥 initialize input
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 Now this only controls raw input
  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {

      if (profile.phoneNo && !/^\+?[0-9]{10,15}$/.test(profile.phoneNo)) {
        setError("Invalid phone number format.");
        setSaving(false);
        return;
      }

      // 🔥 Parse skills ONLY on submit
      const parsedSkills = skillsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("phoneNo", profile.phoneNo || "");
      formData.append("bio", profile.bio || "");
      formData.append("skills", JSON.stringify(parsedSkills));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await API.patch(
        "/users/student/profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      let updatedData = res.data.data;

      // 🔥 normalize again after update
      if (typeof updatedData.skills === "string") {
        try {
          updatedData.skills = JSON.parse(updatedData.skills);
        } catch {
          updatedData.skills = [];
        }
      }

      setProfile(updatedData);
      setSkillsInput((updatedData.skills || []).join(", "));
      setResumeFile(null);
      setSuccess("Profile updated successfully!");

    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="sp-page">Loading profile…</div>;
  }

  if (!profile) {
    return <div className="sp-page">No profile found.</div>;
  }

  const initials = (profile.fullName || "S")
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="sp-page">
      <div className="sp-layout">

        {/* SIDEBAR */}
        <aside className="sp-sidebar">

          <div className="sp-avatar-circle">{initials}</div>

          <h2>{profile.fullName}</h2>

          <p>
            {[profile.courseName, profile.specialization]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>

          <hr />

          <p><b>College:</b> {profile.college?.name || "—"}</p>
          <p><b>PRN:</b> {profile.prn || "—"}</p>
          <p><b>ABC ID:</b> {profile.abcId || "—"}</p>
          <p><b>Year:</b> {profile.Year || "—"}</p>
          <p>
            <b>Duration:</b> {profile.courseStartYear || "—"} – {profile.courseEndYear || "—"}
          </p>

          {profile.skills?.length > 0 && (
            <>
              <hr />
              <div>
                {profile.skills.map((s, i) => (
                  <span key={i} className="sp-chip">{s}</span>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* MAIN */}
        <main className="sp-main">

          <h1>Edit Profile</h1>

          {error && <div className="sp-error">{error}</div>}
          {success && <div className="sp-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            <div>
              <label>Full Name</label>
              <input value={profile.fullName || ""} readOnly />
              <small>Name is managed by your institution.</small>
            </div>

            <div>
              <label>Phone Number</label>
              <input
                name="phoneNo"
                value={profile.phoneNo || ""}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label>Bio</label>
              <textarea
                name="bio"
                rows={4}
                value={profile.bio || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Skills (comma separated)</label>
              <input
                value={skillsInput}
                onChange={handleSkillsChange}
                placeholder="React, Node, Python"
              />
            </div>

            {/* RESUME SECTION */}
            <div style={{ marginTop: "20px" }}>
              <label>Resume</label>

              {profile.resumeUrl ? (
                <div style={{ marginBottom: "10px" }}>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sp-resume-btn"
                  >
                    View Current Resume
                  </a>
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#777" }}>
                  No resume uploaded yet.
                </p>
              )}

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: dragOver ? "2px solid #2563eb" : "1px dashed #aaa",
                  padding: "20px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  textAlign: "center"
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleResumeChange}
                />

                {resumeFile
                  ? <p>{resumeFile.name}</p>
                  : <p>Click or Drag & Drop to Upload / Replace Resume</p>}
              </div>
            </div>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>

        </main>
      </div>
    </div>
  );
}