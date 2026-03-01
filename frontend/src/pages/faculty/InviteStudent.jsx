import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../api/api";

export default function InviteStudent() {

  const currentUser = useSelector(state => state.user.user);
  const profile = useSelector(state => state.user.profile);

  const isFaculty = currentUser?.role === "faculty";

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    courseName: "",
    specialization: "",
    courseStartYear: "",
    courseEndYear: ""
  });

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD COURSES FOR COLLEGE ================= */

  useEffect(() => {
    if (!isFaculty) fetchCourses();
  }, [isFaculty]);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FACULTY AUTO FILL ================= */

  useEffect(() => {
    if (isFaculty && profile) {
      setForm(prev => ({
        ...prev,
        courseName: profile.courseName || "",
        specialization: profile.department || ""
      }));
    }
    console.log(profile);
  }, [isFaculty, profile]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCourseChange = (e) => {

    const courseName = e.target.value;

    const selected = courses.find(
      c => c.name === courseName
    );

    setForm(prev => ({
      ...prev,
      courseName,
      specialization: ""
    }));

    setSpecializations(selected?.specializations || []);
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/student/invite", form);

      alert("Student invited successfully");

      setForm({
        email: "",
        fullName: "",
        courseName: isFaculty ? profile?.courseName || "" : "",
        specialization: isFaculty ? profile?.department || "" : "",
        courseStartYear: "",
        courseEndYear: ""
      });

      

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>

      <h2>{isFaculty ? "Add Student" : "Invite Student"}</h2>

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

        {/* ===== FACULTY LOCKED ===== */}

        {isFaculty ? (
          <>
            <input
              value={form.courseName || ""}
              disabled
              placeholder="Course"
            />

            <input
              value={form.specialization || ""}
              disabled
              placeholder="Specialization"
            />
          </>
        ) : (
          <>
            {/* COURSE DROPDOWN */}

            <select
              value={form.courseName}
              onChange={handleCourseChange}
              required
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
              value={form.specialization}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  specialization: e.target.value
                }))
              }
              disabled={!form.courseName}
            >
              <option value="">
                Select Specialization
              </option>

              {specializations.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}

        <input
          name="courseStartYear"
          placeholder="Start Year"
          value={form.courseStartYear}
          onChange={handleChange}
        />

        <input
          name="courseEndYear"
          placeholder="End Year"
          value={form.courseEndYear}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Inviting..." : "Invite Student"}
        </button>

      </form>

    </div>
  );
}