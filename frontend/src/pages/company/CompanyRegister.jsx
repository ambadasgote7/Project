import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/register.css";

export default function CompanyRegister() {

  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: "",
    selectedCompany: "",
    companyName: "",
    city: "",
    state: "",
    country: "",
    website: "",
    emailDomain: "",
    industry: "",
    companySize: "",
    verificationDocument: null
  });

  const [loading, setLoading] = useState(false);
  const [isOther, setIsOther] = useState(false);


  /* ================= FETCH COMPANY LIST ================= */

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get("/company/list"); // your API
        setCompanies(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);


  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "verificationDocument") {
      setForm(prev => ({
        ...prev,
        verificationDocument: files[0]
      }));
      return;
    }

    if (name === "selectedCompany") {

      if (value === "other") {
        setIsOther(true);
        setForm(prev => ({
          ...prev,
          selectedCompany: "",
          companyName: ""
        }));
      } else {
        setIsOther(false);
        setForm(prev => ({
          ...prev,
          selectedCompany: value
        }));
      }

      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("requesterName", form.requesterName);
      formData.append("requesterEmail", form.requesterEmail);

      if (form.selectedCompany) {
        formData.append("selectedCompany", form.selectedCompany);
      }

      if (isOther) {
        formData.append("companyName", form.companyName);
      }

      formData.append("website", form.website);
      formData.append("emailDomain", form.emailDomain);
      formData.append("industry", form.industry);
      formData.append("companySize", form.companySize);

      const locations = [
        {
          city: form.city,
          state: form.state,
          country: form.country
        }
      ];

      formData.append("locations", JSON.stringify(locations));

      if (form.verificationDocument) {
        formData.append(
          "verificationDocument",
          form.verificationDocument
        );
      }

      await API.post("/onboarding/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Company request submitted. Wait for admin approval.");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Error submitting request"
      );

    } finally {
      setLoading(false);
    }
  };


  /* ================= UI ================= */

  return (
    <div className="register">

      <div className="register__container">

        <h2 className="register__title">
          Company Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="register__form"
        >

          <input
            name="requesterName"
            placeholder="Your Name"
            value={form.requesterName}
            onChange={handleChange}
            required
          />

          <input
            name="requesterEmail"
            type="email"
            placeholder="Official Email"
            value={form.requesterEmail}
            onChange={handleChange}
            required
          />


          {/* ===== COMPANY SELECT ===== */}

          <select
            name="selectedCompany"
            value={form.selectedCompany}
            onChange={handleChange}
          >
            <option value="">Select Company</option>

            {companies.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}

            <option value="other">
              Other (Not Listed)
            </option>
          </select>


          {/* ===== OTHER COMPANY NAME ===== */}

          {isOther && (
            <input
              name="companyName"
              placeholder="Enter Company Name"
              value={form.companyName}
              onChange={handleChange}
              required
            />
          )}


          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />


          <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
          />

          <input
            name="emailDomain"
            placeholder="Email Domain"
            value={form.emailDomain}
            onChange={handleChange}
          />

          <input
            name="industry"
            placeholder="Industry"
            value={form.industry}
            onChange={handleChange}
          />

          <input
            name="companySize"
            placeholder="Company Size"
            value={form.companySize}
            onChange={handleChange}
          />


          <label>
            Verification Document
            <input
              type="file"
              name="verificationDocument"
              onChange={handleChange}
              required
            />
          </label>


          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}