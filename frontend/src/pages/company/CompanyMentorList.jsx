import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/companyMentor.css";

export default function CompanyMentorList() {

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);

  const [editForm, setEditForm] = useState({
    designation: "",
    department: "",
    employeeId: ""
  });

  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    fetchMentors();
  }, []);


  // ================= FETCH =================

  const fetchMentors = async () => {
    try {
      const res = await API.get("/company/mentors");
      setMentors(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };


  // ================= EDIT =================

  const openEdit = (m) => {

    setError("");
    setSuccess("");

    setSelected(m);

    setEditForm({
      designation: m.designation || "",
      department: m.department || "",
      employeeId: m.employeeId || ""
    });
  };


  const closeEdit = () => {
    setSelected(null);
  };


  const handleChange = (e) => {

    const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleUpdate = async () => {

    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {

      await API.patch(
        `/company/mentors/${selected._id}`,
        editForm
      );

      setSuccess("Mentor updated successfully");

      await fetchMentors();
      closeEdit();

    } catch (err) {

      console.error(err);
      setError("Update failed");

    } finally {
      setSaving(false);
    }
  };


  // ================= REMOVE =================

  const handleRemove = async (mentorId) => {

    const confirm = window.confirm(
      "Remove this mentor from company?"
    );

    if (!confirm) return;

    setRemovingId(mentorId);

    try {

      await API.delete(`/company/mentors/${mentorId}`);

      setMentors(prev =>
        prev.filter(m => m._id !== mentorId)
      );

    } catch (err) {
      console.error(err);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };


  if (loading) {
    return <div className="cm-page">Loading mentors...</div>;
  }


  return (
    <div className="cm-page">

      <div className="cm-card">

        <h2>Company Mentors</h2>

        {mentors.length === 0 ? (
          <p>No mentors found.</p>
        ) : (

          <table className="cm-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Employee ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {mentors.map(m => (
                <tr key={m._id}>

                  <td>{m.fullName}</td>
                  <td>{m.user?.email || "—"}</td>
                  <td>{m.department || "—"}</td>
                  <td>{m.designation || "—"}</td>
                  <td>{m.employeeId || "—"}</td>

                  <td>

                    <button
                      className="cm-btn-edit"
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>

                    <button
                      className="cm-btn-delete"
                      disabled={removingId === m._id}
                      onClick={() => handleRemove(m._id)}
                    >
                      {removingId === m._id ? "Removing..." : "Remove"}
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

        <div className="cm-modal">
          <div className="cm-modal-content">

            <h3>Edit Mentor</h3>

            {error && <div className="cm-error">{error}</div>}
            {success && <div className="cm-success">{success}</div>}

            <input
              name="department"
              value={editForm.department}
              onChange={handleChange}
              placeholder="Department"
            />

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


            <div className="cm-modal-actions">

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