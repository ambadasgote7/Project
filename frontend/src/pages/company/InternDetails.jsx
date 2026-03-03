import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/intern-details.css";

export default function InternDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
    FETCH DATA
  */
  const fetchData = async () => {
    try {

      const res = await API.get(`/applications/${id}`);
      setData(res.data.data);

      const mentorRes = await API.get("/company/mentors");
      setMentors(mentorRes.data.data || []);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
    ASSIGN MENTOR
    Only allowed in offer_accepted
  */
  const assignMentor = async (mentorId) => {

    if (!mentorId) return;

    if (data.status !== "offer_accepted") {
      alert("Mentor can only be assigned before internship starts.");
      return;
    }

    try {

      setLoading(true);

      await API.patch(`/applications/${id}/assign-mentor`, {
        mentorId
      });

      await fetchData();

    } catch (err) {
      alert(err.response?.data?.message || "Mentor assignment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <p>Loading...</p>;

  const s = data.studentSnapshot || {};

  /*
    Mentor locked for everything except offer_accepted
  */
  const mentorLocked = data.status !== "offer_accepted";

  const statusColor = (status) => {
    switch (status) {
      case "offer_accepted": return "#2563eb";
      case "ongoing": return "#7c3aed";
      case "completed": return "#16a34a";
      case "terminated": return "#dc2626";
      case "rejected": return "#dc2626";
      default: return "#2563eb";
    }
  };

  return (
    <div className="intern-container">

      <div className="intern-card">

        <h2>Intern Details</h2>

        <div className="info-grid">

          <div>
            <label>Name</label>
            <p>{s.fullName}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{s.email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{s.phoneNo}</p>
          </div>

          <div>
            <label>Status</label>
            <p
              className="status"
              style={{ color: statusColor(data.status) }}
            >
              {data.status.replace("_", " ").toUpperCase()}
            </p>
          </div>

        </div>

        {/* PROGRESS BUTTON ONLY IF STARTED */}
        {["ongoing", "completed", "terminated"].includes(data.status) && (
          <button
            className="progress-btn"
            onClick={() =>
              navigate(`/company/interns/${id}/progress`)
            }
          >
            View Internship Progress
          </button>
        )}

        <hr />

        <h3>Assign Mentor</h3>

        <select
          className="mentor-select"
          value={data.mentor?._id || ""}
          onChange={(e) => assignMentor(e.target.value)}
          disabled={loading || mentorLocked}
        >
          <option value="">Select Mentor</option>

          {mentors.map(m => (
            <option key={m._id} value={m._id}>
              {m.fullName}
            </option>
          ))}
        </select>

        {mentorLocked && (
          <p className="locked-msg">
            Mentor assignment locked after internship starts
          </p>
        )}

        {loading && <p>Assigning mentor...</p>}

      </div>

    </div>
  );
}