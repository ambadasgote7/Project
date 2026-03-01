import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function BrowseInternships() {

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await API.get("/internships/browse");
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const apply = async (id) => {
    try {
      setLoadingId(id);

      await API.post(`/applications/apply/${id}`);

      await fetchData();

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Browse Internships</h2>

      {data.map(item => (

        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            marginBottom: 15
          }}
        >

          <h3>{item.title}</h3>

          <p><b>Company:</b> {item.company?.name}</p>

          <p>
            <b>Mode:</b> {item.mode} | 
            <b> Duration:</b> {item.durationMonths} months
          </p>

          <p>
            <b>Stipend:</b>{" "}
            {item.stipendType === "paid"
              ? `₹${item.stipendAmount}`
              : item.stipendType}
          </p>

          <p>
            <b>Skills:</b>{" "}
            {item.skillsRequired?.slice(0,3).join(", ")}
          </p>

          <p>
            <b>Deadline:</b>{" "}
            {new Date(
              item.applicationDeadline
            ).toLocaleDateString()}
          </p>

          <div style={{ display: "flex", gap: 10 }}>

            <button
              onClick={() =>
                navigate(`/student/internships/${item._id}`)
              }
            >
              View Details
            </button>

            <button
              disabled={
                item.alreadyApplied ||
                loadingId === item._id
              }
              onClick={() => apply(item._id)}
            >
              {item.alreadyApplied
                ? "Applied"
                : loadingId === item._id
                ? "Applying..."
                : "Apply"}
            </button>

          </div>

        </div>
      ))}
    </div>
  );
}