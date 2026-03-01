import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/facultyStudents.css";

export default function FacultyStudents() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    prn: "",
    courseName: "",
    specialization: "",
    phoneNo: ""
  });

  const [saving, setSaving] = useState(false);


  useEffect(() => {
    fetchStudents();
  }, []);


  // =============================
  // FETCH
  // =============================

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
      prn: student.prn || "",
      courseName: student.courseName || "",
      specialization: student.specialization || "",
      phoneNo: student.phoneNo || ""
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
        `/faculty/students/${selected._id}`,
        editForm
      );

      await fetchStudents();
      setSelected(null);

    } catch (err) {
      console.error(err);
      alert("Update failed");
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


      {/* ================= VIEW MODAL ================= */}

      {selected && !editMode && (

        <div className="fs-modal">
          <div className="fs-modal-content">

            <h3>{selected.fullName}</h3>

            <div className="fs-info">

              <p><b>Email:</b> {selected.user?.email}</p>
              <p><b>Course:</b> {selected.courseName}</p>
              <p><b>Specialization:</b> {selected.specialization}</p>
              <p><b>PRN:</b> {selected.prn || "—"}</p>

            </div>


            {/* FUTURE READY */}

            <div className="fs-section">
              <h4>Internship Progress</h4>
              <p className="fs-placeholder">
                Internship applications, mentor logs, credits will appear here.
              </p>
            </div>


            <div className="fs-modal-actions">
              <button onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ================= EDIT MODAL ================= */}

      {selected && editMode && (

        <div className="fs-modal">
          <div className="fs-modal-content">

            <h3>Edit Student</h3>

            <input
              name="prn"
              value={editForm.prn}
              onChange={handleChange}
              placeholder="PRN"
            />

            <input
              name="courseName"
              value={editForm.courseName}
              onChange={handleChange}
              placeholder="Course"
            />

            <input
              name="specialization"
              value={editForm.specialization}
              onChange={handleChange}
              placeholder="Specialization"
            />

            <input
              name="phoneNo"
              value={editForm.phoneNo}
              onChange={handleChange}
              placeholder="Phone"
            />


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