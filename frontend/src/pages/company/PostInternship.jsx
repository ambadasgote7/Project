import React, { useState } from "react";
import API from "../../api/api";
import "../../styles/post-internship.css";

export default function PostInternship() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    applicationDeadline: "",
    durationMonths: 1,
    mode: "remote",
    skillsRequired: "",
    locations: "",
    positions: 1,
    maxApplicants: "",
    stipendType: "paid",
    stipendAmount: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        ...form,
        durationMonths: Number(form.durationMonths),
        positions: Number(form.positions),
        maxApplicants: form.maxApplicants
          ? Number(form.maxApplicants)
          : null,

        skillsRequired: form.skillsRequired
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),

        locations:
          form.mode === "remote"
            ? []
            : form.locations
                .split(",")
                .map(l => l.trim())
                .filter(Boolean)
      };

      const res = await API.post("/internships", payload);

      alert(res.data.message || "Internship posted successfully");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">

      <h2>Post Internship</h2>

      <form className="form" onSubmit={handleSubmit}>

        <label>Internship Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="row">

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={form.applicationDeadline}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <label>Duration</label>
        <select
          name="durationMonths"
          value={form.durationMonths}
          onChange={handleChange}
        >
          {[1,2,3,4,5,6,9,12].map(m => (
            <option key={m} value={m}>
              {m} Month{m > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <label>Mode</label>
        <select name="mode" value={form.mode} onChange={handleChange}>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {form.mode !== "remote" && (
          <>
            <label>Location</label>
            <input
              name="locations"
              placeholder="e.g Pune, Mumbai"
              value={form.locations}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Skills Required</label>
        <input
          name="skillsRequired"
          placeholder="React, Node, MongoDB"
          value={form.skillsRequired}
          onChange={handleChange}
          required
        />

        <div className="row">

          <div>
            <label>Positions</label>
            <input
              type="number"
              name="positions"
              min="1"
              value={form.positions}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Max Applicants</label>
            <input
              type="number"
              name="maxApplicants"
              min="1"
              placeholder="Optional"
              value={form.maxApplicants}
              onChange={handleChange}
            />
          </div>

        </div>

        <label>Stipend Type</label>
        <select
          name="stipendType"
          value={form.stipendType}
          onChange={handleChange}
        >
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="performance_based">Performance Based</option>
        </select>

        {form.stipendType === "paid" && (
          <>
            <label>Stipend Amount (per month ₹)</label>
            <input
              type="number"
              name="stipendAmount"
              min="0"
              placeholder="e.g 10000"
              value={form.stipendAmount}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Post Internship</button>

      </form>

    </div>
  );
}