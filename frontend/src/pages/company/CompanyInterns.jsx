import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInterns() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/company/interns")
      .then(res => setData(res.data.data));
  }, []);

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

          <p>
            <b>Internship:</b> {item.internship?.title}
          </p>

          <p>
            <b>Status:</b> {item.status}
          </p>

          <p>
            <b>Mentor:</b>{" "}
            {item.mentor?.fullName || "Not Assigned"}
          </p>

          <button
            onClick={() =>
              navigate(`/company/intern/${item._id}`)
            }
          >
            View
          </button>

        </div>
      ))}

    </div>
  );
}