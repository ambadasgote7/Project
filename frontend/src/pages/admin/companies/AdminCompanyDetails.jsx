import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCompanyDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchCompany = async () => {
    try {

      const res = await API.get(`/admin/companies/${id}`);
      setCompany(res.data?.data || null);

    } catch (err) {
      console.error("Fetch company error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCompany();
  }, [id]);


  if (loading) return <div className="p-6">Loading...</div>;

  if (!company) return <div className="p-6">Company not found</div>;


  return (
    <div className="p-6 max-w-5xl">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold">
          Company Details
        </h2>

        <button
          onClick={() => navigate(`/admin/companies/edit/${company._id}`)}
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

        <p><strong>Name:</strong> {company.name}</p>
        <p><strong>Industry:</strong> {company.industry || "—"}</p>
        <p><strong>Company Size:</strong> {company.companySize || "—"}</p>
        <p><strong>Website:</strong> {company.website || "—"}</p>
        <p><strong>Email Domain:</strong> {company.emailDomain || "—"}</p>
        <p><strong>Status:</strong> {company.status}</p>
        <p><strong>Description:</strong> {company.description || "—"}</p>

      </div>


      {/* LOCATIONS */}

      <div className="bg-white border rounded p-4">

        <h3 className="font-semibold mb-3">
          Locations
        </h3>

        {company.locations?.length === 0 && (
          <p>No locations added</p>
        )}


        {company.locations?.map((loc, index) => (

          <div
            key={index}
            className="border p-3 rounded mb-3"
          >

            <p><strong>City:</strong> {loc.city}</p>
            <p><strong>State:</strong> {loc.state}</p>
            <p><strong>Country:</strong> {loc.country}</p>

          </div>

        ))}

      </div>

    </div>
  );
}