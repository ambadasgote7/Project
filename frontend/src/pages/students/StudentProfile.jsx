import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import "../../styles/studentProfile.css";

export default function StudentProfile() {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const fileInputRef              = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/student/profile");
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

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setProfile((prev) => ({
      ...prev,
      skills: value.split(",").map((s) => s.trim()).filter(Boolean),
    }));
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
      const formData = new FormData();
      formData.append("fullName", profile.fullName || "");
      formData.append("phoneNo",  profile.phoneNo  || "");
      formData.append("bio",      profile.bio      || "");
      formData.append("skills",   JSON.stringify(profile.skills || []));
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await API.patch("/users/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.data);
      setResumeFile(null);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="sp-page">
        <div className="sp-state">
          <div className="sp-dots"><span /><span /><span /></div>
          <p className="sp-state-text">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (!profile) {
    return (
      <div className="sp-page">
        <div className="sp-state">
          <div className="sp-empty-icon">⊘</div>
          <p className="sp-state-text">No profile found.</p>
        </div>
      </div>
    );
  }

  const statusClass =
    profile.profileStatus === "completed" ? "sp-badge--done" :
    profile.profileStatus === "pending"   ? "sp-badge--pending" :
                                            "sp-badge--incomplete";

  const initials = (profile.fullName || "S")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="sp-page">
      {/* decorative blobs */}
      <div className="sp-blob sp-blob-1" aria-hidden="true" />
      <div className="sp-blob sp-blob-2" aria-hidden="true" />

      <div className="sp-layout">

        {/* ════════════ SIDEBAR ════════════ */}
        <aside className="sp-sidebar">

          <div className="sp-avatar">
            <div className="sp-avatar-glow" />
            <div className="sp-avatar-circle">{initials}</div>
          </div>

          <h2 className="sp-sidebar-name">{profile.fullName || "Student"}</h2>

          <p className="sp-sidebar-course">
            {[profile.courseName, profile.specialization].filter(Boolean).join(" · ") || "—"}
          </p>

          <span className={`sp-badge ${statusClass}`}>
            <span className="sp-badge-dot" />
            {profile.profileStatus}
          </span>

          <div className="sp-divider" />

          <ul className="sp-meta">
            <li className="sp-meta-item">
              <span className="sp-meta-icon">🏛</span>
              <div>
                <div className="sp-meta-key">College</div>
                <div className="sp-meta-val">{profile.college?.name || "—"}</div>
              </div>
            </li>
            <li className="sp-meta-item">
              <span className="sp-meta-icon">🪪</span>
              <div>
                <div className="sp-meta-key">PRN</div>
                <div className="sp-meta-val">{profile.prn || "—"}</div>
              </div>
            </li>
            <li className="sp-meta-item">
              <span className="sp-meta-icon">📅</span>
              <div>
                <div className="sp-meta-key">Duration</div>
                <div className="sp-meta-val">
                  {profile.courseStartYear || "—"} – {profile.courseEndYear || "—"}
                </div>
              </div>
            </li>
          </ul>

          {profile.skills?.length > 0 && (
            <>
              <div className="sp-divider" />
              <p className="sp-sidebar-skills-heading">Skills</p>
              <div className="sp-sidebar-chips">
                {profile.skills.map((s, i) => (
                  <span className="sp-chip" key={i}>{s}</span>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* ════════════ MAIN FORM ════════════ */}
        <main className="sp-main">

          <header className="sp-main-header">
            <h1 className="sp-main-title">Edit Profile</h1>
            <p className="sp-main-sub">Keep your information up to date</p>
          </header>

          <form className="sp-form" onSubmit={handleSubmit} noValidate>

            {error   && <div className="sp-alert sp-alert--error"><span>✕</span>{error}</div>}
            {success && <div className="sp-alert sp-alert--success"><span>✓</span>{success}</div>}

            {/* ── Section 01 ── */}
            <section className="sp-section">
              <div className="sp-section-label">
                <span className="sp-section-num">01</span>
                Personal Details
              </div>

              <div className="sp-row">
                <div className="sp-field">
                  <label className="sp-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName" className="sp-input" name="fullName"
                    value={profile.fullName || ""} onChange={handleChange}
                    placeholder="Your full name" required
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="phoneNo">Phone Number</label>
                  <input
                    id="phoneNo" className="sp-input" name="phoneNo"
                    value={profile.phoneNo || ""} onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className="sp-label" htmlFor="bio">Bio</label>
                <textarea
                  id="bio" className="sp-textarea" name="bio" rows={4}
                  value={profile.bio || ""} onChange={handleChange}
                  placeholder="Tell recruiters a bit about yourself…"
                />
              </div>
            </section>

            {/* ── Section 02 ── */}
            <section className="sp-section">
              <div className="sp-section-label">
                <span className="sp-section-num">02</span>
                Skills
              </div>

              <div className="sp-field">
                <label className="sp-label" htmlFor="skills">Skills</label>
                <input
                  id="skills" className="sp-input"
                  value={profile.skills?.join(", ") || ""}
                  onChange={handleSkillsChange}
                  placeholder="React, Node.js, Python, Figma…"
                />
                <p className="sp-hint">Separate each skill with a comma</p>
                {profile.skills?.length > 0 && (
                  <div className="sp-chips-live">
                    {profile.skills.map((s, i) => (
                      <span className="sp-chip sp-chip--live" key={i}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ── Section 03 ── */}
            <section className="sp-section">
              <div className="sp-section-label">
                <span className="sp-section-num">03</span>
                Resume
              </div>

              {profile.resumeUrl && !resumeFile && (
                <div className="sp-resume-current">
                  <span>📄</span>
                  <span className="sp-resume-current-name">Current Resume</span>
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer"
                    className="sp-resume-link">View ↗</a>
                </div>
              )}

              <div
                className={`sp-dropzone${dragOver ? " sp-dropzone--over" : ""}${resumeFile ? " sp-dropzone--ready" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef} type="file" accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange} className="sp-file-hidden"
                />
                {resumeFile ? (
                  <div className="sp-dropzone-file">
                    <span className="sp-dropzone-file-icon">✅</span>
                    <div className="sp-dropzone-file-meta">
                      <span className="sp-dropzone-file-name">{resumeFile.name}</span>
                      <span className="sp-dropzone-file-size">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button type="button" className="sp-dropzone-remove"
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="sp-dropzone-idle">
                    <div className="sp-dropzone-icon">⬆</div>
                    <p className="sp-dropzone-text">
                      Drop your resume here, or <span className="sp-dropzone-browse">browse</span>
                    </p>
                    <p className="sp-dropzone-formats">PDF · DOC · DOCX</p>
                  </div>
                )}
              </div>
            </section>

            <div className="sp-form-footer">
              <button className="sp-save-btn" type="submit" disabled={saving}>
                {saving && <span className="sp-save-spinner" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}