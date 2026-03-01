import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/collegeFaculty.css";

export default function CollegeFacultyList() {

  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [editForm, setEditForm] = useState({
    courseName: "",
    department: "",
    designation: "",
    employeeId: "",
    joiningYear: ""
  });

  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    fetchFaculty();
    fetchCourses();
  }, []);


  // ================= FETCH FACULTY =================

  const fetchFaculty = async () => {
    try {
      const res = await API.get("/college/faculty");
      setFaculty(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };


  // ================= FETCH COURSES =================

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  // ================= OPEN EDIT =================

  const openEdit = (f) => {

    setError("");
    setSuccess("");

    setSelected(f);

    setEditForm({
      courseName: f.courseName ?? "",
      department: f.department ?? "",
      designation: f.designation ?? "",
      employeeId: f.employeeId ?? "",
      joiningYear: f.joiningYear ?? ""
    });
  };


  const closeEdit = () => {
    setSelected(null);
  };


  // ================= FORM CHANGE =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "courseName" ? { department: "" } : {})
    }));
  };


  // ================= UPDATE =================

  const handleUpdate = async () => {

    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {

      await API.patch(
        `/college/faculty/${selected._id}`,
        editForm
      );

      setSuccess("Faculty updated successfully");

      await fetchFaculty();
      closeEdit();

    } catch (err) {

      console.error(err);
      setError("Update failed");

    } finally {
      setSaving(false);
    }
  };


  // ================= REMOVE =================

  const handleRemove = async (facultyId) => {

    const confirm = window.confirm(
      "Remove this faculty from college?"
    );

    if (!confirm) return;

    setRemovingId(facultyId);

    try {

      await API.delete(`/college/faculty/${facultyId}`);

      setFaculty(prev =>
        prev.filter(f => f._id !== facultyId)
      );

    } catch (err) {
      console.error(err);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };


  // ================= SPECIALIZATION OPTIONS =================

  const selectedCourse = courses.find(
    c =>
      c.name?.trim().toLowerCase() ===
      (editForm.courseName || "").trim().toLowerCase()
  );

  const specializations =
    selectedCourse?.specializations || [];


  if (loading) {
    return <div className="cf-page">Loading faculty...</div>;
  }


  return (
    <div className="cf-page">

      <div className="cf-card">

        <h2>College Faculty</h2>

        {faculty.length === 0 ? (
          <p>No faculty found.</p>
        ) : (

          <table className="cf-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Specialization</th>
                <th>Designation</th>
                <th>Employee ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {faculty.map(f => (
                <tr key={f._id}>

                  <td>{f.fullName}</td>
                  <td>{f.courseName || "—"}</td>
                  <td>{f.department || "—"}</td>
                  <td>{f.designation || "—"}</td>
                  <td>{f.employeeId || "—"}</td>

                  <td>

                    <button
                      className="cf-btn-edit"
                      onClick={() => openEdit(f)}
                    >
                      Edit
                    </button>

                    <button
                      className="cf-btn-delete"
                      disabled={removingId === f._id}
                      onClick={() => handleRemove(f._id)}
                    >
                      {removingId === f._id ? "Removing..." : "Remove"}
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>


      {/* ================= MODAL ================= */}

      {selected && (

        <div className="cf-modal">
          <div className="cf-modal-content">

            <h3>Edit Faculty</h3>

            {error && <div className="cf-error">{error}</div>}
            {success && <div className="cf-success">{success}</div>}


            {/* COURSE */}

            <select
              name="courseName"
              value={editForm.courseName}
              onChange={handleChange}
            >
              <option value="">Select Course</option>

              {courses.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}

            </select>


            {/* SPECIALIZATION */}

            <select
              name="department"
              value={editForm.department}
              onChange={handleChange}
              disabled={!editForm.courseName}
            >
              <option value="">Select Specialization</option>

              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}

            </select>


            <input
              name="designation"
              value={editForm.designation}
              onChange={handleChange}
              placeholder="Designation"
            />

            <input
              name="employeeId"
              value={editForm.employeeId}
              onChange={handleChange}
              placeholder="Employee ID"
            />

            <input
              name="joiningYear"
              value={editForm.joiningYear}
              onChange={handleChange}
              placeholder="Joining Year"
            />


            <div className="cf-modal-actions">

              <button
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button onClick={closeEdit}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}