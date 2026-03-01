import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/companyProfile.css";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoFile, setLogoFile] = useState(null);

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
      const res = await API.get("/company/profile");
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

  const handleLocationChange = (index, field, value) => {
    const updated = [...(profile.locations || [])];
    updated[index][field] = value;
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const addLocation = () => {
    const updated = [...(profile.locations || [])];
    updated.push({ city: "", state: "", country: "" });
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const removeLocation = (index) => {
    const updated = [...(profile.locations || [])];
    updated.splice(index, 1);
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let res;

      if (logoFile) {
        const formData = new FormData();

        formData.append("name", profile.name || "");
        formData.append("website", profile.website || "");
        formData.append("industry", profile.industry || "");
        formData.append("companySize", profile.companySize || "");
        formData.append("description", profile.description || "");
        formData.append("locations", JSON.stringify(profile.locations || []));
        formData.append("logo", logoFile);

        res = await API.patch("/company/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        const payload = {
          name: profile.name || "",
          website: profile.website || "",
          industry: profile.industry || "",
          companySize: profile.companySize || "",
          description: profile.description || "",
          locations: profile.locations || []
        };

        res = await API.patch("/company/profile", payload);
      }

      setProfile(res.data.data);
      setSuccess("Profile updated successfully!");
      setLogoFile(null);
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="cp-page">Loading...</div>;
  if (!profile) return <div className="cp-page">No profile found</div>;

  return (
    <div className="cp-page">
      <div className="cp-card">

        {/* Header */}
        <div className="cp-header">
          <div className="cp-logo">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="logo" />
            ) : (
              <div className="cp-logo-placeholder">
                {profile.name?.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h2>{profile.name}</h2>
            <span className={`cp-status ${profile.status}`}>
              {(profile.status).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="cp-error">{error}</div>}
        {success && <div className="cp-success">{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="cp-grid">

            <div>
              <label>Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Website</label>
              <input
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Industry</label>
              <input
                name="industry"
                value={profile.industry || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Company Size</label>
              <input
                name="companySize"
                value={profile.companySize || ""}
                onChange={handleChange}
              />
            </div>

          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              value={profile.description || ""}
              onChange={handleChange}
            />
          </div>

          {/* Locations */}
          <div className="cp-locations">
            <h3>Locations</h3>

            {profile.locations?.map((loc, index) => (
              <div key={index} className="cp-location-row">
                <input
                  placeholder="City"
                  value={loc.city || ""}
                  onChange={(e) =>
                    handleLocationChange(index, "city", e.target.value)
                  }
                />
                <input
                  placeholder="State"
                  value={loc.state || ""}
                  onChange={(e) =>
                    handleLocationChange(index, "state", e.target.value)
                  }
                />
                <input
                  placeholder="Country"
                  value={loc.country || ""}
                  onChange={(e) =>
                    handleLocationChange(index, "country", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button type="button" onClick={addLocation}>
              + Add Location
            </button>
          </div>

          {/* Logo */}
          <div>
            <label>Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </div>

          {/* Readonly */}
          <div className="cp-readonly">
            <p><strong>Email Domain:</strong> {profile.emailDomain}</p>
            <p><strong>Approved At:</strong> {profile.approvedAt || "—"}</p>
          </div>

          <button
            type="submit"
            className={`cp-btn ${saving ? "cp-btn-loading" : ""}`}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="cp-spinner" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}