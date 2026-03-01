import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Edit-internship.css";

export default function EditInternship() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [locked, setLocked] = useState(false);
  const [closed, setClosed] = useState(false);

  const [selectedCount, setSelectedCount] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    positions: "",
    maxApplicants: "",
    applicationDeadline: "",
    mode: "remote",
    stipendType: "paid",
    stipendAmount: ""
  });

  /*
    LOAD
  */
  const fetchInternship = async () => {

    try {

      const res = await API.get(`/internships/${id}`);
      const data = res.data.data;

      setForm({
        title: data.title || "",
        description: data.description || "",
        positions: data.positions || "",
        maxApplicants: data.maxApplicants || "",
        applicationDeadline: data.applicationDeadline
          ? data.applicationDeadline.substring(0, 10)
          : "",
        mode: data.mode || "remote",
        stipendType: data.stipendType || "paid",
        stipendAmount: data.stipendAmount || ""
      });

      setSelectedCount(data.selectedCount || 0);

      if (data.applicationsCount > 0) {
        setLocked(true);
      }

      if (data.status === "closed") {
        setClosed(true);
      }

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, []);

  /*
    CHANGE
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /*
    SUBMIT
  */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (closed) {
      alert("Cannot edit closed internship");
      return;
    }

    try {

      setSaving(true);

      const payload = {
        ...form,
        positions: Number(form.positions),
        maxApplicants: form.maxApplicants
          ? Number(form.maxApplicants)
          : null,
        stipendAmount: form.stipendAmount
          ? Number(form.stipendAmount)
          : null
      };

      await API.patch(`/internships/${id}`, payload);

      alert("Internship updated successfully");

      navigate("/company/internships");

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="editContainer">

      <h2>Edit Internship</h2>

      {closed && (
        <p className="error">
          This internship is closed and cannot be edited.
        </p>
      )}

      {locked && !closed && (
        <p className="warning">
          Students have applied. Some fields are restricted.
          Positions cannot go below selected students ({selectedCount}).
          Stipend can only be increased.
        </p>
      )}

      <form className="form" onSubmit={handleSubmit}>

        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={closed}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={closed}
        />

        <label>Positions</label>
        <input
          type="number"
          min={selectedCount || 1}
          name="positions"
          value={form.positions}
          onChange={handleChange}
          disabled={closed}
        />

        <label>Max Applicants</label>
        <input
          type="number"
          min="1"
          name="maxApplicants"
          value={form.maxApplicants}
          onChange={handleChange}
          disabled={closed}
        />

        <label>Application Deadline</label>
        <input
          type="date"
          name="applicationDeadline"
          value={form.applicationDeadline}
          onChange={handleChange}
          disabled={closed}
        />

        <label>Mode</label>
        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          disabled={locked || closed}
        >
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <label>Stipend Type</label>
        <select
          name="stipendType"
          value={form.stipendType}
          onChange={handleChange}
          disabled={locked || closed}
        >
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="performance_based">
            Performance Based
          </option>
        </select>

        {form.stipendType === "paid" && (
          <>
            <label>Stipend Amount (₹ per month)</label>
            <input
              type="number"
              min="0"
              name="stipendAmount"
              value={form.stipendAmount}
              onChange={handleChange}
              disabled={closed}
            />
          </>
        )}

        <button disabled={saving || closed}>
          {saving ? "Saving..." : "Update Internship"}
        </button>

      </form>

    </div>
  );
}