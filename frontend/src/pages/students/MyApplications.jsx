import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/my-applications.css";

export default function MyApplications() {

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  /*
    FETCH
  */
  const fetchData = async () => {
    try {
      const res = await API.get("/applications/my");
      setData(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
    STATUS COLOR
  */
  const statusColor = (status) => {
    switch (status) {
      case "applied": return "#6b7280";
      case "shortlisted": return "#2563eb";
      case "selected": return "#16a34a";
      case "offer_accepted": return "#059669";
      case "rejected": return "#dc2626";
      case "withdrawn": return "#9ca3af";
      case "ongoing": return "#7c3aed";
      case "completed": return "#10b981";
      case "terminated": return "#b91c1c";
      default: return "#000";
    }
  };

  /*
    FORMAT STATUS
  */
  const formatStatus = (status) =>
    status.replace("_", " ").toUpperCase();

  /*
    ACTION HANDLER
  */
  const actionHandler = async (id, action) => {

    try {

      setLoadingId(id);

      if (action === "withdraw") {

        await API.patch(`/applications/${id}/withdraw`);

      } else {

        // accept or decline
        await API.patch(`/applications/${id}/offer`, {
          decision: action
        });

      }

      await fetchData();

    } catch (err) {

      alert(err.response?.data?.message || "Action failed");

    } finally {

      setLoadingId(null);

    }
  };

  return (
    <div className="container">

      <h2>My Applications</h2>

      {data.length === 0 && (
        <p>No applications yet</p>
      )}

      {data.map(app => {

        const internship = app.internship || {};

        const canWithdraw =
          app.status === "applied" ||
          app.status === "shortlisted";

        const canAccept =
          app.status === "selected";

        const waitingStart =
          app.status === "offer_accepted";

        return (
          <div key={app._id} className="card">

            <h3>{internship.title}</h3>

            <p>
              <b>Company:</b> {internship.company?.name}
            </p>

            <p>
              <b>Mode:</b> {internship.mode}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: statusColor(app.status)
                }}
              >
                {formatStatus(app.status)}
              </span>
            </p>

            <p>
              <b>Applied At:</b>{" "}
              {new Date(app.appliedAt).toDateString()}
            </p>

            {app.resumeSnapshot && (
              <p>
                <a
                  href={app.resumeSnapshot}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Submitted Resume
                </a>
              </p>
            )}

            {app.mentor && (
              <p>
                <b>Mentor:</b> {app.mentor?.fullName}
              </p>
            )}

            <div className="actions">

              {canWithdraw && (
                <button
                  disabled={loadingId === app._id}
                  onClick={() =>
                    actionHandler(app._id, "withdraw")
                  }
                >
                  {loadingId === app._id
                    ? "Processing..."
                    : "Withdraw"}
                </button>
              )}

              {canAccept && (
                <>
                  <button
                    className="accept"
                    disabled={loadingId === app._id}
                    onClick={() =>
                      actionHandler(app._id, "accept")
                    }
                  >
                    {loadingId === app._id
                      ? "Processing..."
                      : "Accept Offer"}
                  </button>

                  <button
                    className="decline"
                    disabled={loadingId === app._id}
                    onClick={() =>
                      actionHandler(app._id, "decline")
                    }
                  >
                    {loadingId === app._id
                      ? "Processing..."
                      : "Decline"}
                  </button>
                </>
              )}

              {waitingStart && (
                <span className="badge">
                  Waiting for internship to start
                </span>
              )}

            </div>

          </div>
        );
      })}
    </div>
  );
}