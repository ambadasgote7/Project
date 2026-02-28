import axios from "axios";
import AdminNavBar from "../../components/navbars/AdminNavBar";
import { BASE_URL } from "../../utils/constants";
import { useState } from "react";

const AddCollege = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleAddCollege = async () => {
    if (!name.trim() || !location.trim()) {
      alert("College name and location are required");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/college/add-college`,
        { name, location },
        { withCredentials: true }
      );
      alert("College added successfully");
      setName("");
      setLocation("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col">
      <AdminNavBar />

      <main className="w-full flex-grow flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-3">
            Add College
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Register a new institution into InternStatus
          </p>
        </div>

        <div className="w-full max-w-xl bg-white rounded-md shadow-lg border border-[#FFEDC7] p-8 md:p-10 transition-all">
          <div className="space-y-7">
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                College Name
              </label>
              <input
                type="text"
                value={name}
                placeholder="e.g. Institute of Technology"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide uppercase">
                Location
              </label>
              <input
                type="text"
                value={location}
                placeholder="e.g. Mumbai, Maharashtra"
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3.5 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFEDC7] focus:border-[#EB4C4C] transition-all duration-200 text-[#1A1A1A] text-base"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleAddCollege}
                className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-base tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Submit College
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AddCollege;