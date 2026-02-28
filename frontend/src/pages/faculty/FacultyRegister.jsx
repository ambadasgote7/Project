import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const FacultyRegister = () => {
  const user = useSelector((state) => state.user);
  const requesterEmail = user?.email || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    requesterName: "",
    college: "",
    collegeWebsite: "",
  });

  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([
    { facultyName: "", facultyEmail: "" },
  ]);

  const [verificationFile, setVerificationFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/college`);
        setColleges(res.data?.colleges || []);
      } catch (err) {
        setMessage("Unable to load colleges");
      }
    };
    fetchColleges();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFacultyChange = (index, field, value) => {
    const updated = [...faculties];
    updated[index][field] = value;
    setFaculties(updated);
  };

  const addFaculty = () => {
    setFaculties([...faculties, { facultyName: "", facultyEmail: "" }]);
  };

  const removeFaculty = (index) => {
    if (faculties.length === 1) return;
    setFaculties(faculties.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setMessage("");
    setSuccess(false);

    if (!form.requesterName.trim()) {
      setMessage("Requester name is required");
      return;
    }

    if (!form.college) {
      setMessage("College selection is required");
      return;
    }

    if (!verificationFile) {
      setMessage("Verification document is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("requesterName", form.requesterName.trim());
      formData.append("college", form.college);

      if (form.collegeWebsite.trim()) {
        formData.append("collegeWebsite", form.collegeWebsite.trim());
      }

      formData.append(
        "requestedFaculties",
        JSON.stringify(
          faculties.filter(
            (f) => f.facultyName.trim() && f.facultyEmail.trim()
          )
        )
      );

      formData.append("verificationDocument", verificationFile);

      await axios.post(`${BASE_URL}/api/faculty/register`, formData, {
        withCredentials: true,
      });

      setSuccess(true);
      setTimeout(() => navigate("/pending-verification"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="text-center mb-10 border-b border-[#FFEDC7] pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-3">
            Faculty Portal Registration
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Provide your institution details for verification.
          </p>
        </div>

        {message && (
          <div className="mb-8 text-sm text-[#EB4C4C] bg-[#FFA6A6]/20 border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-semibold shadow-sm">
            {message}
          </div>
        )}

        {success && (
          <div className="mb-8 text-sm text-[#1A1A1A] bg-[#FFEDC7] border-l-4 border-[#EB4C4C] rounded-r-md px-5 py-4 font-bold shadow-sm">
            Registration submitted. Redirecting...
          </div>
        )}

        <section className="bg-white rounded-md shadow-sm border border-[#FFEDC7] p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6 border-b border-gray-100 pb-4">
            Identity Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Requester Name
              </label>
              <input
                name="requesterName"
                placeholder="e.g. Dr. John Smith"
                value={form.requesterName}
                onChange={handleFormChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Email
              </label>
              <input
                value={requesterEmail}
                disabled
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-100 text-gray-500 font-medium cursor-not-allowed text-base"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-md shadow-sm border border-[#FFEDC7] p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6 border-b border-gray-100 pb-4">
            Institution Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                College / University
              </label>
              <select
                name="college"
                value={form.college}
                onChange={handleFormChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base font-medium cursor-pointer"
              >
                <option value="">Select College / University</option>
                {colleges.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Official Website
              </label>
              <input
                name="collegeWebsite"
                placeholder="https://university.edu"
                value={form.collegeWebsite}
                onChange={handleFormChange}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-md shadow-sm border border-[#FFEDC7] p-8 md:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Faculty Members
              </h2>
              <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide">
                (Optional) Add initial roster
              </p>
            </div>
            
            <button
              type="button"
              onClick={addFaculty}
              className="px-4 py-2 rounded-md bg-[#FFEDC7]/50 text-[#EB4C4C] font-bold text-sm hover:bg-[#FFEDC7] transition-all duration-200"
            >
              + Add Another
            </button>
          </div>

          <div className="space-y-4">
            {faculties.map((f, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50/50 p-4 rounded-md border border-gray-200">
                <div className="w-full flex-1">
                  <input
                    placeholder="Faculty Name"
                    value={f.facultyName}
                    onChange={(e) =>
                      handleFacultyChange(i, "facultyName", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm"
                  />
                </div>
                
                <div className="w-full flex-1">
                  <input
                    placeholder="Faculty Email"
                    value={f.facultyEmail}
                    onChange={(e) =>
                      handleFacultyChange(i, "facultyEmail", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeFaculty(i)}
                  disabled={faculties.length === 1}
                  className="w-full md:w-auto px-4 py-3 rounded-md border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-[#EB4C4C] hover:text-[#EB4C4C] hover:bg-[#FFA6A6]/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-md shadow-sm border border-[#FFEDC7] p-8 md:p-10">
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-2">
            Verification Document
          </h2>
          <p className="text-base font-medium text-gray-500 mb-6">
            Upload institutional authorization proof (.pdf or image)
          </p>

          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#FFEDC7] rounded-md cursor-pointer bg-gray-50/50 hover:bg-[#FFEDC7]/20 transition-all duration-200 group">
            <span className="px-5 py-2.5 rounded-md bg-[#FFEDC7] text-[#EB4C4C] font-bold text-sm mb-4 group-hover:bg-[#FFA6A6]/40 transition-colors">
              Browse Files
            </span>
            <p className="text-sm font-bold text-gray-600 tracking-wide">
              {verificationFile
                ? verificationFile.name
                : "Click to upload document"}
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => setVerificationFile(e.target.files[0])}
            />
          </label>
        </section>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-lg tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
          >
            {loading ? "Submitting for Approval..." : "Submit for Approval"}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FacultyRegister;