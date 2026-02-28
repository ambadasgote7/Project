import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Courses() {

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    durationYears: ""
  });

  const [specializationInput, setSpecializationInput] = useState("");
  const [specializations, setSpecializations] = useState([]);

  const [editingCourse, setEditingCourse] = useState(null);

  /* ================= FETCH ================= */

  

  useEffect(() => {
    const fetchCourses = async () => {
    const res = await API.get("/college/courses");
    setCourses(res.data?.data || []);
  };
  
    fetchCourses();
  }, []);

  /* ================= SPECIALIZATION ================= */

  const addSpecialization = () => {
    if (!specializationInput.trim()) return;

    setSpecializations([
      ...specializations,
      specializationInput.trim()
    ]);

    setSpecializationInput("");
  };

  const removeSpecialization = (index) => {
    const updated = [...specializations];
    updated.splice(index, 1);
    setSpecializations(updated);
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {

    if (!form.name || !form.durationYears) {
      alert("Name and duration required");
      return;
    }

    try {

      if (editingCourse) {

        await API.patch(
          `/college/courses/${editingCourse.name}`,
          {
            ...form,
            specializations
          }
        );

      } else {

        await API.post("/college/courses", {
          ...form,
          specializations
        });
      }

      resetForm();
      fetchCourses();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /* ================= DELETE ================= */

  const deleteCourse = async (name) => {
    await API.delete(`/college/courses/${name}`);
    fetchCourses();
  };

  /* ================= EDIT ================= */

  const startEdit = (course) => {

    setEditingCourse(course);

    setForm({
      name: course.name,
      durationYears: course.durationYears
    });

    setSpecializations(course.specializations || []);
  };

  const resetForm = () => {
    setForm({
      name: "",
      durationYears: ""
    });

    setSpecializations([]);
    setEditingCourse(null);
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40 }}>

      <h2>Courses</h2>

      {/* ===== FORM ===== */}

      <div style={{ marginBottom: 20 }}>

        <input
          placeholder="Course Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Duration Years"
          value={form.durationYears}
          onChange={e =>
            setForm({ ...form, durationYears: e.target.value })
          }
        />

        {/* SPECIALIZATION TAG INPUT */}

        <div style={{ marginTop: 10 }}>

          <input
            placeholder="Add Specialization"
            value={specializationInput}
            onChange={e =>
              setSpecializationInput(e.target.value)
            }
          />

          <button type="button" onClick={addSpecialization}>
            Add
          </button>

        </div>

        {/* TAG LIST */}

        <div style={{ marginTop: 10 }}>

          {specializations.map((s, i) => (
            <span
              key={i}
              style={{
                border: "1px solid gray",
                padding: "4px 8px",
                marginRight: 5,
                display: "inline-block"
              }}
            >
              {s}
              <button
                onClick={() => removeSpecialization(i)}
                style={{ marginLeft: 5 }}
              >
                x
              </button>
            </span>
          ))}

        </div>

        <div style={{ marginTop: 10 }}>

          <button onClick={handleSubmit}>
            {editingCourse ? "Update Course" : "Add Course"}
          </button>

          {editingCourse && (
            <button onClick={resetForm}>
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* ===== TABLE ===== */}

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Specializations</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {courses.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.durationYears}</td>

              <td>
                {c.specializations?.join(", ")}
              </td>

              <td>

                <button onClick={() => startEdit(c)}>
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(c.name)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}