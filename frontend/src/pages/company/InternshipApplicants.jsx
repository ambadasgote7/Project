import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";
import "../../styles/InternshipApplicants.css";

export default function InternshipApplicants() {

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/internship/${id}`);
      setData(res.data.data || []);
    } catch {
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (appId, status) => {

    const confirmAction = window.confirm(
      `Are you sure you want to mark as ${status}?`
    );

    if (!confirmAction) return;

    setLoadingId(appId);

    try {
      await API.patch(`/applications/${appId}/status`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  /*
    Only hiring-phase actions allowed
  */
  const renderActions = (app) => {

    switch (app.status) {

      case "applied":
        return (
          <>
            <button
              onClick={() => updateStatus(app._id, "shortlisted")}
              disabled={loadingId === app._id}
            >
              Shortlist
            </button>

            <button
              onClick={() => updateStatus(app._id, "rejected")}
              disabled={loadingId === app._id}
              className="danger"
            >
              Reject
            </button>
          </>
        );

      case "shortlisted":
        return (
          <>
            <button
              onClick={() => updateStatus(app._id, "selected")}
              disabled={loadingId === app._id}
            >
              Select
            </button>

            <button
              onClick={() => updateStatus(app._id, "rejected")}
              disabled={loadingId === app._id}
              className="danger"
            >
              Reject
            </button>
          </>
        );

      case "selected":
        return (
          <span className="badge info">
            Waiting for student acceptance
          </span>
        );

      case "offer_accepted":
        return <span className="badge success">Offer Accepted</span>;

      case "rejected":
        return <span className="badge danger">Rejected</span>;

      case "withdrawn":
        return <span className="badge muted">Withdrawn</span>;

      case "ongoing":
        return <span className="badge info">Internship Ongoing</span>;

      case "completed":
        return <span className="badge success">Completed</span>;

      case "terminated":
        return <span className="badge danger">Terminated</span>;

      default:
        return null;
    }
  };

  return (
    <div className="container">

      <h2>Applicants</h2>

      {data.length === 0 && (
        <p>No applications found.</p>
      )}

      {data.map(app => {

        const s = app.studentSnapshot || {};

        return (
          <div key={app._id} className="card">

            <h3>{s.fullName}</h3>

            <p><b>College:</b> {s.collegeName}</p>

            <p>
              <b>Course:</b> {s.courseName} — {s.specialization}
            </p>

            <p><b>Email:</b> {s.email}</p>
            <p><b>Phone:</b> {s.phoneNo}</p>

            <p>
              <b>Skills:</b>{" "}
              {app.skillsSnapshot?.length
                ? app.skillsSnapshot.join(", ")
                : "—"}
            </p>

            {app.resumeSnapshot && (
              <p>
                <a
                  href={app.resumeSnapshot}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              </p>
            )}

            <p className="status">
              Status: <b>{app.status}</b>
            </p>

            <div className="actions">
              {renderActions(app)}
            </div>

          </div>
        );
      })}

    </div>
  );
}