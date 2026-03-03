import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/collegeStudents.css";

export default function CollegeStudents() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    courseName: "",
    specialization: "",
    courseStartYear: "",
    courseEndYear: "",
    Year: "",
    prn: "",
    abcId: "",
    status: "active"
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/college/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // VIEW
  // =============================

  const openView = (student) => {
    setSelected(student);
    setEditMode(false);
  };

  // =============================
  // EDIT
  // =============================

  const openEdit = (student) => {
    setSelected(student);
    setEditMode(true);

    setEditForm({
      courseName: student.courseName || "",
      specialization: student.specialization || "",
      courseStartYear: student.courseStartYear || "",
      courseEndYear: student.courseEndYear || "",
      Year: student.Year || "",
      prn: student.prn || "",
      abcId: student.abcId || "",
      status: student.status || "active"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selected) return;

    setSaving(true);

    try {
      await API.patch(
        `/college/students/${selected._id}`,
        editForm
      );

      await fetchStudents();
      setSelected(null);

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // REMOVE
  // =============================

  const handleRemove = async (id) => {
    const ok = window.confirm("Remove student from college?");
    if (!ok) return;

    try {
      await API.delete(`/college/students/${id}`);

      setStudents(prev =>
        prev.filter(s => s._id !== id)
      );

    } catch (err) {
      console.error(err);
      alert("Remove failed");
    }
  };

  if (loading) {
    return <div className="cs-page">Loading...</div>;
  }

  return (
    <div className="cs-page">

      <div className="cs-card">

        <h2>College Students</h2>

        <table className="cs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Specialization</th>
              <th>PRN</th>
              <th>Academic Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.fullName}</td>
                <td>{s.courseName || "—"}</td>
                <td>{s.specialization || "—"}</td>
                <td>{s.prn || "—"}</td>
                <td>{s.Year || "—"}</td>
                <td>{s.status}</td>
                <td>
                  <button
                    className="cs-btn-view"
                    onClick={() => openView(s)}
                  >
                    View
                  </button>

                  <button
                    className="cs-btn-edit"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="cs-btn-delete"
                    onClick={() => handleRemove(s._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ================= VIEW MODAL ================= */}

      {selected && !editMode && (
        <div className="cs-modal">
          <div className="cs-modal-content">

            <h3>{selected.fullName}</h3>

            <div className="cs-info">
              <p><b>Email:</b> {selected.user?.email}</p>
              <p><b>Course:</b> {selected.courseName}</p>
              <p><b>Specialization:</b> {selected.specialization}</p>
              <p><b>Course Start:</b> {selected.courseStartYear}</p>
              <p><b>Course End:</b> {selected.courseEndYear}</p>
              <p><b>Academic Year:</b> {selected.Year}</p>
              <p><b>PRN:</b> {selected.prn || "—"}</p>
              <p><b>ABC ID:</b> {selected.abcId || "—"}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>

            <div className="cs-modal-actions">
              <button onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}

      {selected && editMode && (
        <div className="cs-modal">
          <div className="cs-modal-content">

            <h3>Edit Student (Academic Only)</h3>

            <input
              name="courseName"
              value={editForm.courseName}
              onChange={handleChange}
              placeholder="Course Name"
            />

            <input
              name="specialization"
              value={editForm.specialization}
              onChange={handleChange}
              placeholder="Specialization"
            />

            <input
              name="courseStartYear"
              type="number"
              value={editForm.courseStartYear}
              onChange={handleChange}
              placeholder="Course Start Year"
            />

            <input
              name="courseEndYear"
              type="number"
              value={editForm.courseEndYear}
              onChange={handleChange}
              placeholder="Course End Year"
            />

            <input
              name="Year"
              type="number"
              value={editForm.Year}
              onChange={handleChange}
              placeholder="Academic Year"
            />

            <input
              name="prn"
              value={editForm.prn}
              onChange={handleChange}
              placeholder="PRN"
            />

            <input
              name="abcId"
              value={editForm.abcId}
              onChange={handleChange}
              placeholder="ABC ID (12 digits)"
            />

            <select
              name="status"
              value={editForm.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="inactive">Inactive</option>
              <option value="unassigned">Unassigned</option>
            </select>

            <div className="cs-modal-actions">

              <button
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button onClick={() => setSelected(null)}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}