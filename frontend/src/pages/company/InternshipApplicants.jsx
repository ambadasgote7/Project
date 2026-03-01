import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";
import "../../styles/InternshipApplicants.css";

export default function InternshipApplicants() {

  const { id } = useParams();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await API.get(`/applications/internship/${id}`);
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/applications/${appId}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  /*
    ACTIONS BASED ON STATUS
  */
  const renderActions = (app) => {

    const status = app.status;

    if (["completed", "rejected", "withdrawn", "terminated"].includes(status)) {
      return <span className="badge locked">No actions</span>;
    }

    switch (status) {

      case "applied":
        return (
          <>
            <button onClick={() => updateStatus(app._id, "shortlisted")}>
              Shortlist
            </button>
            <button onClick={() => updateStatus(app._id, "rejected")}>
              Reject
            </button>
          </>
        );

      case "shortlisted":
        return (
          <>
            <button onClick={() => updateStatus(app._id, "selected")}>
              Select
            </button>
            <button onClick={() => updateStatus(app._id, "rejected")}>
              Reject
            </button>
          </>
        );

      case "selected":
        return <span className="badge info">Waiting for student</span>;

      case "offer_accepted":
        return (
          <button onClick={() => updateStatus(app._id, "ongoing")}>
            Start Internship
          </button>
        );

      case "ongoing":
        return (
          <>
            <button onClick={() => updateStatus(app._id, "completed")}>
              Complete
            </button>
            <button onClick={() => updateStatus(app._id, "terminated")}>
              Terminate
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">

      <h2>Applicants</h2>

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
              <b>Skills:</b> {app.skillsSnapshot?.join(", ")}
            </p>

            {app.resumeSnapshot && (
              <a
                href={app.resumeSnapshot}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
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