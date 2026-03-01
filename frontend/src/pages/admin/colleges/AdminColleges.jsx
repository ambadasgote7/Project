import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminColleges() {

  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchColleges = async () => {
    try {

      const res = await API.get("/admin/colleges");
      setColleges(res.data?.data || []);

    } catch (err) {
      console.error("Fetch colleges error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchColleges();
  }, []);


  const toggleStatus = async (id, currentStatus) => {
    try {

      const newStatus =
        currentStatus === "active" ? "inactive" : "active";

      await API.patch(`/admin/colleges/${id}/status`, {
        status: newStatus
      });

      fetchColleges();

    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };


  if (loading) return <div className="p-6">Loading...</div>;


  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-semibold">
          Colleges
        </h2>

        <button
          onClick={() => navigate("/admin/colleges/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add College
        </button>

      </div>


      <div className="bg-white border rounded overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Email Domain</th>
              <th className="p-3 border text-left">Website</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>

          </thead>


          <tbody>

            {colleges.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No colleges found
                </td>
              </tr>
            )}


            {colleges.map(college => (

              <tr key={college._id}>

                <td className="p-3 border">
                  {college.name}
                </td>

                <td className="p-3 border">
                  {college.emailDomain || "—"}
                </td>

                <td className="p-3 border">
                  {college.website || "—"}
                </td>

                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      college.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {college.status}
                  </span>
                </td>


                <td className="p-3 border flex gap-2">

                  <button
                    onClick={() =>
                      navigate(`/admin/colleges/${college._id}`)
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/colleges/edit/${college._id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      toggleStatus(college._id, college.status)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    {college.status === "active"
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}