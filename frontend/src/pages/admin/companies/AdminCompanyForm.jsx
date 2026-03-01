import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCompanyForm() {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    website: "",
    emailDomain: "",
    industry: "",
    companySize: "",
    description: "",
    locations: []
  });


  /* ================= FETCH EXISTING ================= */

  const fetchCompany = async () => {
    try {

      const res = await API.get(`/admin/companies/${id}`);
      setForm(res.data?.data);

    } catch (err) {
      console.error(err);
      alert("Failed to load company");
    }
  };

  useEffect(() => {
    if (isEdit) fetchCompany();
  }, [id]);


  /* ================= FORM CHANGE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  /* ================= LOCATIONS ================= */

  const addLocation = () => {

    setForm({
      ...form,
      locations: [
        ...form.locations,
        { city: "", state: "", country: "" }
      ]
    });
  };


  const updateLocation = (index, field, value) => {

    const updated = [...form.locations];
    updated[index][field] = value;

    setForm({
      ...form,
      locations: updated
    });
  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      if (isEdit) {

        await API.put(`/admin/companies/${id}`, form);

      } else {

        await API.post(`/admin/companies`, form);

      }

      navigate("/admin/companies");

    } catch (err) {

      console.error(err);
      alert("Save failed");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 max-w-4xl">

      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Company" : "Add Company"}
      </h2>


      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="website"
          placeholder="Website"
          value={form.website || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="emailDomain"
          placeholder="Email Domain"
          value={form.emailDomain || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="industry"
          placeholder="Industry"
          value={form.industry || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="companySize"
          placeholder="Company Size"
          value={form.companySize || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />


        {/* LOCATIONS */}

        <div className="border p-4 rounded">

          <div className="flex justify-between mb-3">

            <h3 className="font-semibold">
              Locations
            </h3>

            <button
              type="button"
              onClick={addLocation}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add Location
            </button>

          </div>


          {form.locations.map((loc, index) => (

            <div key={index} className="border p-3 mb-3 rounded">

              <input
                placeholder="City"
                value={loc.city}
                onChange={(e) =>
                  updateLocation(index, "city", e.target.value)
                }
                className="w-full border p-2 mb-2 rounded"
              />

              <input
                placeholder="State"
                value={loc.state}
                onChange={(e) =>
                  updateLocation(index, "state", e.target.value)
                }
                className="w-full border p-2 mb-2 rounded"
              />

              <input
                placeholder="Country"
                value={loc.country}
                onChange={(e) =>
                  updateLocation(index, "country", e.target.value)
                }
                className="w-full border p-2 rounded"
              />

            </div>

          ))}

        </div>


        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>

      </form>

    </div>
  );
}