import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/register.css";

export default function CollegeRegister() {

  const [colleges, setColleges] = useState([]);

  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    selectedCollege: "",
    collegeName: "",
    location: "",
    website: "",
    emailDomain: "",
    verificationDocument: null
  });

  const [loading, setLoading] = useState(false);
  const [isOther, setIsOther] = useState(false);


  /* ================= FETCH COLLEGE LIST ================= */

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await API.get("/college/list"); // your college list API
        setColleges(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchColleges();
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

    if (name === "selectedCollege") {

      if (value === "other") {
        setIsOther(true);
        setForm(prev => ({
          ...prev,
          selectedCollege: "",
          collegeName: ""
        }));
      } else {
        setIsOther(false);
        setForm(prev => ({
          ...prev,
          selectedCollege: value
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
      formData.append("requesterPhone", form.requesterPhone);

      if (form.selectedCollege) {
        formData.append("selectedCollege", form.selectedCollege);
      }

      if (isOther) {
        formData.append("collegeName", form.collegeName);
      }

      formData.append("location", form.location);
      formData.append("website", form.website);
      formData.append("emailDomain", form.emailDomain);

      if (form.verificationDocument) {
        formData.append(
          "verificationDocument",
          form.verificationDocument
        );
      }

      await API.post("/onboarding/college", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Request submitted. Wait for admin approval.");

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
          College Registration
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

          <input
            name="requesterPhone"
            placeholder="Phone Number"
            value={form.requesterPhone}
            onChange={handleChange}
            required
          />


          {/* ===== COLLEGE SELECT ===== */}

          <select
            name="selectedCollege"
            value={form.selectedCollege}
            onChange={handleChange}
          >
            <option value="">Select College</option>

            {colleges.map(col => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}

            <option value="other">
              Other (Not Listed)
            </option>
          </select>


          {/* ===== OTHER COLLEGE NAME ===== */}

          {isOther && (
            <input
              name="collegeName"
              placeholder="Enter College Name"
              value={form.collegeName}
              onChange={handleChange}
              required
            />
          )}


          <input
            name="location"
            placeholder="Address"
            value={form.location}
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
            placeholder="Email Domain (example.edu)"
            value={form.emailDomain}
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