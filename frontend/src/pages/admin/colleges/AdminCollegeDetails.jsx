import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCollegeDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchCollege = async () => {
    try {

      const res = await API.get(`/admin/colleges/${id}`);
      setCollege(res.data?.data || null);

    } catch (err) {
      console.error("Fetch college error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCollege();
  }, [id]);


  if (loading) return <div className="p-6">Loading...</div>;

  if (!college) return <div className="p-6">College not found</div>;


  return (
    <div className="p-6 max-w-5xl">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold">
          College Details
        </h2>

        <button
          onClick={() => navigate(`/admin/colleges/edit/${college._id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

      </div>


      {/* BASIC INFO */}

      <div className="bg-white border rounded p-4 mb-6">

        <h3 className="font-semibold mb-3">
          Basic Information
        </h3>

        <p><strong>Name:</strong> {college.name}</p>
        <p><strong>Address:</strong> {college.address || "—"}</p>
        <p><strong>Phone:</strong> {college.phone || "—"}</p>
        <p><strong>Website:</strong> {college.website || "—"}</p>
        <p><strong>Email Domain:</strong> {college.emailDomain || "—"}</p>
        <p><strong>Status:</strong> {college.status}</p>
        <p><strong>Description:</strong> {college.description || "—"}</p>

      </div>


      {/* COURSES */}

      <div className="bg-white border rounded p-4">

        <h3 className="font-semibold mb-3">
          Courses
        </h3>

        {college.courses?.length === 0 && (
          <p>No courses added</p>
        )}


        {college.courses?.map((course, index) => (

          <div
            key={index}
            className="border p-3 rounded mb-3"
          >

            <p><strong>Course:</strong> {course.name}</p>
            <p><strong>Duration:</strong> {course.durationYears} years</p>

            <div>
              <strong>Specializations:</strong>

              {course.specializations?.length === 0 ? (
                <span> — </span>
              ) : (
                <ul className="list-disc ml-5">
                  {course.specializations.map((sp, i) => (
                    <li key={i}>{sp}</li>
                  ))}
                </ul>
              )}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}