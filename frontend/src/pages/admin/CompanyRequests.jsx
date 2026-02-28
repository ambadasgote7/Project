import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchRequests();
  }, []);


  const fetchRequests = async () => {
    try {

      const res = await API.get("/onboarding/company");

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
        `/onboarding/company/${id}/status`,
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

      <h2>Company Onboarding Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}


      {requests.map((req) => {

        const companyName =
          req.selectedCompany?.name ||
          req.companyName ||
          "—";

        const isExisting = !!req.selectedCompany;

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
              {companyName}
              {isExisting && (
                <span style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: "green"
                }}>
                  (Existing Company)
                </span>
              )}
            </h3>


            <p><b>Requester:</b> {req.requesterName}</p>
            <p><b>Email:</b> {req.requesterEmail}</p>


            {/* Locations */}
            <p>
              <b>Locations:</b>{" "}
              {req.locations?.length > 0
                ? req.locations.map((loc, i) => (
                    <span key={i}>
                      {loc.city}, {loc.state}, {loc.country}
                      {i !== req.locations.length - 1 && " | "}
                    </span>
                  ))
                : "N/A"}
            </p>


            <p><b>Website:</b> {req.website || "N/A"}</p>
            <p><b>Email Domain:</b> {req.emailDomain || "N/A"}</p>
            <p><b>Industry:</b> {req.industry || "N/A"}</p>
            <p><b>Company Size:</b> {req.companySize || "N/A"}</p>
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