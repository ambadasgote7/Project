import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInterns() {

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    const res = await API.get("/company/interns");
    setData(res.data.data || []);
  };

  const updateStatus = async (id, status) => {

    const confirmAction = window.confirm(
      `Are you sure you want to mark as ${status}?`
    );

    if (!confirmAction) return;

    setLoadingId(id);

    try {
      await API.patch(`/applications/${id}/status`, { status });
      await fetchInterns();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Company Interns</h2>

      {data.map(item => (

        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10
          }}
        >

          <h3>{item.student?.fullName}</h3>

          <p><b>Internship:</b> {item.internship?.title}</p>
          <p><b>Status:</b> {item.status}</p>
          <p>
            <b>Mentor:</b>{" "}
            {item.mentor?.fullName || "Not Assigned"}
          </p>

          <div style={{ marginTop: 10 }}>

            {item.status === "offer_accepted" && (
              <button
                onClick={() => updateStatus(item._id, "ongoing")}
                disabled={loadingId === item._id}
              >
                Start Internship
              </button>
            )}

            {item.status === "ongoing" && (
              <>
                <button
                  onClick={() => updateStatus(item._id, "completed")}
                  disabled={loadingId === item._id}
                >
                  Complete
                </button>

                <button
                  onClick={() => updateStatus(item._id, "terminated")}
                  disabled={loadingId === item._id}
                  style={{ marginLeft: 10 }}
                >
                  Terminate
                </button>
              </>
            )}

            <button
              style={{ marginLeft: 10 }}
              onClick={() =>
                navigate(`/company/intern/${item._id}`)
              }
            >
              View
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}