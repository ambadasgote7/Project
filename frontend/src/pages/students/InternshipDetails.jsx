import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";

export default function InternshipDetails() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await API.get(`/internships/${id}`);
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const apply = async () => {
    try {
      setLoading(true);

      await API.post(`/applications/apply/${id}`);

      await fetchData();

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>

      <h2>{data.title}</h2>

      <p><b>Company:</b> {data.company?.name}</p>

      <p><b>Description:</b> {data.description}</p>

      <p><b>Mode:</b> {data.mode}</p>

      <p><b>Duration:</b> {data.durationMonths} months</p>

      <p>
        <b>Start Date:</b>{" "}
        {new Date(data.startDate).toDateString()}
      </p>

      <p>
        <b>Deadline:</b>{" "}
        {new Date(data.applicationDeadline).toDateString()}
      </p>

      <p>
        <b>Stipend:</b>{" "}
        {data.stipendType === "paid"
          ? `₹${data.stipendAmount}`
          : data.stipendType}
      </p>

      <p>
        <b>Skills Required:</b>{" "}
        {data.skillsRequired?.join(", ")}
      </p>

      <p>
        <b>Positions:</b> {data.positions}
      </p>

      <p>
        <b>Eligibility:</b>
      </p>

      <ul>
        <li>Courses: {data.eligibility?.courses?.join(", ")}</li>
        <li>Specializations: {data.eligibility?.specializations?.join(", ")}</li>
        <li>Year: {data.eligibility?.minYear} - {data.eligibility?.maxYear}</li>
      </ul>

      <button
        disabled={data.alreadyApplied || loading}
        onClick={apply}
      >
        {data.alreadyApplied
          ? "Already Applied"
          : loading
          ? "Applying..."
          : "Apply"}
      </button>

    </div>
  );
}