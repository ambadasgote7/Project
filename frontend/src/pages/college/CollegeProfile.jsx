import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/collegeProfile.css";

export default function CollegeProfile() {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchCollege(); }, []);

  const fetchCollege = async () => {
    try {
      const res = await API.get("/college/profile");
      setCollege(res.data.data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollege((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await API.patch("/college/profile", {
        name:        college.name,
        website:     college.website,
        phone:       college.phone,
        address:     college.address,
        description: college.description,
      });
      setCollege(res.data.data);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="cp-page">
        <div className="cp-state">
          <div className="cp-dots"><span /><span /><span /></div>
          <p className="cp-state-text">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (!college) {
    return (
      <div className="cp-page">
        <div className="cp-state">
          <div className="cp-empty-icon">⊘</div>
          <p className="cp-state-text">No data found.</p>
        </div>
      </div>
    );
  }

  const abbr = (college.name || "C")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="cp-page">
      <div className="cp-blob cp-blob-1" aria-hidden="true" />
      <div className="cp-blob cp-blob-2" aria-hidden="true" />

      <div className="cp-layout">

        {/* ════ SIDEBAR ════ */}
        <aside className="cp-sidebar">

          <div className="cp-avatar">
            <div className="cp-avatar-glow" />
            <div className="cp-avatar-circle">{abbr}</div>
          </div>

          <h2 className="cp-sidebar-name">{college.name || "College"}</h2>

          {college.website && (
            <a
              className="cp-sidebar-website"
              href={college.website}
              target="_blank"
              rel="noreferrer"
            >
              🌐 {college.website.replace(/^https?:\/\//, "")}
            </a>
          )}

          <div className="cp-divider" />

          <ul className="cp-meta">
            <li className="cp-meta-item">
              <span className="cp-meta-icon">📞</span>
              <div>
                <div className="cp-meta-key">Phone</div>
                <div className="cp-meta-val">{college.phone || "—"}</div>
              </div>
            </li>
            <li className="cp-meta-item">
              <span className="cp-meta-icon">📍</span>
              <div>
                <div className="cp-meta-key">Address</div>
                <div className="cp-meta-val">{college.address || "—"}</div>
              </div>
            </li>
          </ul>

          {college.description && (
            <>
              <div className="cp-divider" />
              <p className="cp-sidebar-desc-label">About</p>
              <p className="cp-sidebar-desc">{college.description}</p>
            </>
          )}
        </aside>

        {/* ════ MAIN ════ */}
        <main className="cp-main">

          <header className="cp-main-header">
            <h1 className="cp-main-title">College Profile</h1>
            <p className="cp-main-sub">Manage your institution's details</p>
          </header>

          <form className="cp-form" onSubmit={handleSubmit} noValidate>

            {error   && <div className="cp-alert cp-alert--error"><span>✕</span>{error}</div>}
            {success && <div className="cp-alert cp-alert--success"><span>✓</span>{success}</div>}

            {/* ── 01 Identity ── */}
            <section className="cp-section">
              <div className="cp-section-label">
                <span className="cp-section-num">01</span>
                Identity
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="name">College Name</label>
                <input
                  id="name" className="cp-input" name="name"
                  value={college.name || ""} onChange={handleChange}
                  placeholder="e.g. MIT College of Engineering"
                  required
                />
              </div>

              <div className="cp-row">
                <div className="cp-field">
                  <label className="cp-label" htmlFor="website">Website</label>
                  <input
                    id="website" className="cp-input" name="website"
                    value={college.website || ""} onChange={handleChange}
                    placeholder="https://yourcollege.edu"
                    type="url"
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-label" htmlFor="phone">Phone</label>
                  <input
                    id="phone" className="cp-input" name="phone"
                    value={college.phone || ""} onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </section>

            {/* ── 02 Location ── */}
            <section className="cp-section">
              <div className="cp-section-label">
                <span className="cp-section-num">02</span>
                Location
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="address">Address</label>
                <input
                  id="address" className="cp-input" name="address"
                  value={college.address || ""} onChange={handleChange}
                  placeholder="123 University Road, City, State"
                />
              </div>
            </section>

            {/* ── 03 About ── */}
            <section className="cp-section">
              <div className="cp-section-label">
                <span className="cp-section-num">03</span>
                About
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="description">Description</label>
                <textarea
                  id="description" className="cp-textarea" name="description"
                  rows={5} value={college.description || ""} onChange={handleChange}
                  placeholder="Write a brief description of your institution…"
                />
              </div>
            </section>

            <div className="cp-form-footer">
              <button className="cp-save-btn" type="submit" disabled={saving}>
                {saving && <span className="cp-save-spinner" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}