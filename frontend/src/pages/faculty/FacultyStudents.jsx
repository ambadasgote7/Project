import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/facultyStudents.css";

export default function FacultyStudents() {

  const COURSE_DURATION = 4;
  const CURRENT_YEAR = new Date().getFullYear();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
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

  useEffect(() => {
    if (editForm.courseStartYear) {
      const endYear =
        Number(editForm.courseStartYear) + COURSE_DURATION;

      setEditForm(prev => ({
        ...prev,
        courseEndYear: endYear
      }));
    }
  }, [editForm.courseStartYear]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/faculty/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openView = (student) => {
    setSelected(student);
    setEditMode(false);
  };

  const openEdit = (student) => {
    setSelected(student);
    setEditMode(true);

    setEditForm({
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

    // Frontend ABC validation
    if (editForm.abcId && !/^\d{12}$/.test(editForm.abcId)) {
      alert("ABC ID must be exactly 12 digits");
      return;
    }

    setSaving(true);

    try {

      const payload = {
        courseStartYear: editForm.courseStartYear
          ? Number(editForm.courseStartYear)
          : undefined,
        courseEndYear: editForm.courseEndYear
          ? Number(editForm.courseEndYear)
          : undefined,
        Year: editForm.Year
          ? Number(editForm.Year)
          : undefined,
        prn: editForm.prn || undefined,
        abcId: editForm.abcId || undefined,
        status: editForm.status
      };

      await API.patch(
        `/faculty/students/${selected._id}`,
        payload
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

  if (loading) {
    return <div className="fs-page">Loading students...</div>;
  }

  return (
    <div className="fs-page">

      <div className="fs-card">

        <h2>My Students</h2>

        {students.length === 0 ? (
          <p>No students assigned.</p>
        ) : (

          <table className="fs-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Specialization</th>
                <th>PRN</th>
                <th>Year</th>
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
                      className="fs-btn-view"
                      onClick={() => openView(s)}
                    >
                      View
                    </button>

                    <button
                      className="fs-btn-edit"
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* VIEW MODAL */}
      {selected && !editMode && (
        <div className="fs-modal">
          <div className="fs-modal-content">

            <h3>{selected.fullName}</h3>

            <div className="fs-info">
              <p><b>Email:</b> {selected.user?.email}</p>
              <p><b>Course:</b> {selected.courseName}</p>
              <p><b>Specialization:</b> {selected.specialization}</p>
              <p><b>Course Start:</b> {selected.courseStartYear}</p>
              <p><b>Course End:</b> {selected.courseEndYear}</p>
              <p><b>Year:</b> {selected.Year}</p>
              <p><b>PRN:</b> {selected.prn || "—"}</p>
              <p><b>ABC ID:</b> {selected.abcId || "—"}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>

            <div className="fs-modal-actions">
              <button onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {selected && editMode && (
        <div className="fs-modal">
          <div className="fs-modal-content">

            <h3>Edit Student (Academic Only)</h3>

            <select
              name="courseStartYear"
              value={editForm.courseStartYear}
              onChange={handleChange}
            >
              <option value="">Select Start Year</option>
              {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i)
                .map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>

            <select
              name="Year"
              value={editForm.Year}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {[...Array(COURSE_DURATION)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <input
              name="courseEndYear"
              value={editForm.courseEndYear}
              readOnly
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

            <div className="fs-modal-actions">

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