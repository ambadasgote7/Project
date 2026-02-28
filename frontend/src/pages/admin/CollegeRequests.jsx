import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CollegeRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchRequests();
  }, []);


  const fetchRequests = async () => {
    try {

      const res = await API.get("/onboarding/college");

      setRequests(res.data.data || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };


  const handleAction = async (id, status) => {
    try {

      await API.patch(
        `/onboarding/college/${id}/status`,
        { status }
      );

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status } : r
        )
      );

    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };


  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;


  return (
    <div style={{ padding: 20 }}>

      <h2>College Onboarding Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}


      {requests.map((req) => {

        const collegeName =
          req.selectedCollege?.name ||
          req.collegeName ||
          "—";

        const isExisting = !!req.selectedCollege;

        return (
          <div
            key={req._id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 15,
              borderRadius: 8,
              background: "#fff"
            }}
          >

            <h3>
              {collegeName}
              {isExisting && (
                <span style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: "green"
                }}>
                  (Existing College)
                </span>
              )}
            </h3>


            <p><b>Requester:</b> {req.requesterName}</p>
            <p><b>Email:</b> {req.requesterEmail}</p>
            <p><b>Phone:</b> {req.requesterPhone || "N/A"}</p>
            <p><b>Address:</b> {req.location}</p>
            <p><b>Website:</b> {req.website || "N/A"}</p>
            <p><b>Email Domain:</b> {req.emailDomain || "N/A"}</p>
            <p><b>Status:</b> {req.status}</p>


            <p>
              <b>Verification Document:</b>{" "}
              <a
                href={req.verificationDocumentUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Document
              </a>
            </p>


            {req.status === "pending" && (
              <div style={{ marginTop: 10 }}>

                <button
                  onClick={() =>
                    handleAction(req._id, "approved")
                  }
                >
                  Approve
                </button>

                <button
                  style={{ marginLeft: 10 }}
                  onClick={() =>
                    handleAction(req._id, "rejected")
                  }
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}