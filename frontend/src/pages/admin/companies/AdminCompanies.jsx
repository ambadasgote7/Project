import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCompanies() {

  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchCompanies = async () => {
    try {

      const res = await API.get("/admin/companies");
      setCompanies(res.data?.data || []);

    } catch (err) {
      console.error("Fetch companies error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCompanies();
  }, []);


  const toggleStatus = async (id, currentStatus) => {
    try {

      const newStatus =
        currentStatus === "active" ? "inactive" : "active";

      await API.patch(`/admin/companies/${id}/status`, {
        status: newStatus
      });

      fetchCompanies();

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
          Companies
        </h2>

        <button
          onClick={() => navigate("/admin/companies/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Company
        </button>

      </div>


      <div className="bg-white border rounded overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Industry</th>
              <th className="p-3 border text-left">Website</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>

          </thead>


          <tbody>

            {companies.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No companies found
                </td>
              </tr>
            )}


            {companies.map(company => (

              <tr key={company._id}>

                <td className="p-3 border">
                  {company.name}
                </td>

                <td className="p-3 border">
                  {company.industry || "—"}
                </td>

                <td className="p-3 border">
                  {company.website || "—"}
                </td>

                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      company.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {company.status}
                  </span>
                </td>


                <td className="p-3 border flex gap-2">

                  <button
                    onClick={() =>
                      navigate(`/admin/companies/${company._id}`)
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/companies/edit/${company._id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      toggleStatus(company._id, company.status)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    {company.status === "active"
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