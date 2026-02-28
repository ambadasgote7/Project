import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function InviteFaculty() {

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    courseName: "",
    specialization: "",
    designation: ""
  });

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH COURSES ================= */

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCourseChange = (e) => {
    const courseName = e.target.value;

    const selected = courses.find(
      c => c.name === courseName
    );

    setForm({
      ...form,
      courseName,
      specialization: ""
    });

    setSpecializations(selected?.specializations || []);
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/faculty/invite", form);

      alert("Faculty invited successfully");

      setForm({
        email: "",
        fullName: "",
        courseName: "",
        specialization: "",
        designation: ""
      });

      setSpecializations([]);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h2>Invite Faculty</h2>

      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
      >

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        {/* COURSE DROPDOWN */}
        <select
          name="courseName"
          value={form.courseName}
          onChange={handleCourseChange}
        >
          <option value="">Select Course</option>

          {courses.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SPECIALIZATION DROPDOWN */}
        <select
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          disabled={!form.courseName}
        >
          <option value="">Select Specialization</option>

          {specializations.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Inviting..." : "Invite Faculty"}
        </button>

      </form>
    </div>
  );
}