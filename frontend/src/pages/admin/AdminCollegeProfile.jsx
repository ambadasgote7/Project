import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import "../../styles/adminCollegeProfile.css";

export default function AdminCollegeProfile() {
  const { id } = useParams();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchCollege(); }, [id]);

  const fetchCollege = async () => {
    try {
      const res = await API.get(`/college/${id}`);
      setCollege(res.data.data);
    } catch {
      setError("Failed to load college");
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
      const res = await API.patch(`/college/${id}`, {
        name:        college.name,
        website:     college.website,
        phone:       college.phone,
        address:     college.address,
        description: college.description,
      });
      setCollege(res.data.data);
      setSuccess("College updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="acp-page">
        <div className="acp-state">
          <div className="acp-dots"><span /><span /><span /></div>
          <p className="acp-state-text">Loading college…</p>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (!college) {
    return (
      <div className="acp-page">
        <div className="acp-state">
          <div className="acp-empty-icon">⊘</div>
          <p className="acp-state-text">No data found.</p>
        </div>
      </div>
    );
  }

  const abbr = (college.name || "C")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="acp-page">
      <div className="acp-blob acp-blob-1" aria-hidden="true" />
      <div className="acp-blob acp-blob-2" aria-hidden="true" />

      <div className="acp-layout">

        {/* ════ SIDEBAR ════ */}
        <aside className="acp-sidebar">

          {/* Admin badge */}
          <div className="acp-admin-tag">
            <span className="acp-admin-dot" />
            Admin View
          </div>

          <div className="acp-avatar">
            <div className="acp-avatar-glow" />
            <div className="acp-avatar-circle">{abbr}</div>
          </div>

          <h2 className="acp-sidebar-name">{college.name || "College"}</h2>

          {college.website && (
            <a
              className="acp-sidebar-website"
              href={college.website}
              target="_blank"
              rel="noreferrer"
            >
              🌐 {college.website.replace(/^https?:\/\//, "")}
            </a>
          )}

          <div className="acp-divider" />

          <ul className="acp-meta">
            <li className="acp-meta-item">
              <span className="acp-meta-icon">🆔</span>
              <div>
                <div className="acp-meta-key">College ID</div>
                <div className="acp-meta-val acp-meta-id">{id}</div>
              </div>
            </li>
            <li className="acp-meta-item">
              <span className="acp-meta-icon">📞</span>
              <div>
                <div className="acp-meta-key">Phone</div>
                <div className="acp-meta-val">{college.phone || "—"}</div>
              </div>
            </li>
            <li className="acp-meta-item">
              <span className="acp-meta-icon">📍</span>
              <div>
                <div className="acp-meta-key">Address</div>
                <div className="acp-meta-val">{college.address || "—"}</div>
              </div>
            </li>
          </ul>

          {college.description && (
            <>
              <div className="acp-divider" />
              <p className="acp-sidebar-desc-label">About</p>
              <p className="acp-sidebar-desc">{college.description}</p>
            </>
          )}
        </aside>

        {/* ════ MAIN ════ */}
        <main className="acp-main">

          <header className="acp-main-header">
            <div className="acp-breadcrumb">Admin / Colleges / Edit</div>
            <h1 className="acp-main-title">Edit College</h1>
            <p className="acp-main-sub">Modify this institution's details</p>
          </header>

          <form className="acp-form" onSubmit={handleSubmit} noValidate>

            {error   && <div className="acp-alert acp-alert--error"><span>✕</span>{error}</div>}
            {success && <div className="acp-alert acp-alert--success"><span>✓</span>{success}</div>}

            {/* ── 01 Identity ── */}
            <section className="acp-section">
              <div className="acp-section-label">
                <span className="acp-section-num">01</span>
                Identity
              </div>

              <div className="acp-field">
                <label className="acp-label" htmlFor="name">College Name</label>
                <input
                  id="name" className="acp-input" name="name"
                  value={college.name || ""} onChange={handleChange}
                  placeholder="e.g. MIT College of Engineering"
                  required
                />
              </div>

              <div className="acp-row">
                <div className="acp-field">
                  <label className="acp-label" htmlFor="website">Website</label>
                  <input
                    id="website" className="acp-input" name="website"
                    value={college.website || ""} onChange={handleChange}
                    placeholder="https://yourcollege.edu"
                    type="url"
                  />
                </div>
                <div className="acp-field">
                  <label className="acp-label" htmlFor="phone">Phone</label>
                  <input
                    id="phone" className="acp-input" name="phone"
                    value={college.phone || ""} onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </section>

            {/* ── 02 Location ── */}
            <section className="acp-section">
              <div className="acp-section-label">
                <span className="acp-section-num">02</span>
                Location
              </div>

              <div className="acp-field">
                <label className="acp-label" htmlFor="address">Address</label>
                <input
                  id="address" className="acp-input" name="address"
                  value={college.address || ""} onChange={handleChange}
                  placeholder="123 University Road, City, State"
                />
              </div>
            </section>

            {/* ── 03 About ── */}
            <section className="acp-section">
              <div className="acp-section-label">
                <span className="acp-section-num">03</span>
                About
              </div>

              <div className="acp-field">
                <label className="acp-label" htmlFor="description">Description</label>
                <textarea
                  id="description" className="acp-textarea" name="description"
                  rows={5} value={college.description || ""} onChange={handleChange}
                  placeholder="Write a brief description of the institution…"
                />
              </div>
            </section>

            <div className="acp-form-footer">
              <button className="acp-save-btn" type="submit" disabled={saving}>
                {saving && <span className="acp-save-spinner" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}