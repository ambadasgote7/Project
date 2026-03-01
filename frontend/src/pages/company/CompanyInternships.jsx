import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInternships() {

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await API.get("/internships/company");
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {

      setLoadingId(id);

      const newStatus =
        currentStatus === "open" ? "closed" : "open";

      await API.patch(`/internships/${id}/status`, {
        status: newStatus
      });

      fetchData();

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>My Internships</h2>

      {data.length === 0 && <p>No internships posted yet</p>}

      {data.map(item => {

        const isOpen = item.status === "open";

        return (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15
            }}
          >

            <h3>{item.title}</h3>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color: isOpen ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                {item.status.toUpperCase()}
              </span>
            </p>

            <p>
              <b>Positions:</b> {item.positions}
            </p>

            <p>
              <b>Max Applicants:</b> {item.maxApplicants}
            </p>

            <p>
              <b>Deadline:</b>{" "}
              {new Date(
                item.applicationDeadline
              ).toDateString()}
            </p>

            <div style={{ display: "flex", gap: 10 }}>

              <button
                onClick={() =>
                  navigate(
                    `/company/internship/${item._id}/applicants`
                  )
                }
              >
                View Applicants
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/company/internship/${item._id}/edit`
                  )
                }
              >
                Edit
              </button>

              <button
                disabled={loadingId === item._id}
                onClick={() =>
                  toggleStatus(item._id, item.status)
                }
              >
                {loadingId === item._id
                  ? "Updating..."
                  : isOpen
                  ? "Close"
                  : "Open"}
              </button>

            </div>

          </div>
        );
      })}
    </div>
  );
}