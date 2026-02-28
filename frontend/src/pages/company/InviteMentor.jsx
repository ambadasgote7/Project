import React, { useState } from "react";
import API from "../../api/api";

export default function InviteMentor() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    designation: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/mentor/invite", form);

      alert("Mentor invited successfully. Setup email sent.");

      setForm({
        email: "",
        fullName: "",
        designation: "",
        department: "",
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite mentor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Add Mentor</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Invite Mentor"}
        </button>
      </form>
    </div>
  );
}