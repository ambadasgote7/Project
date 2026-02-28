import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const VerifiedStudentRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifiedStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/faculty/verified-student-requests`,
          { withCredentials: true }
        );
        setStudents(res.data?.verifiedRequests || []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifiedStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex justify-center items-center font-sans">
        <p className="text-[#EB4C4C] font-bold text-lg animate-pulse">Loading verified students...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 font-sans flex flex-col px-6 py-12">
      <div className="w-full flex-grow">

        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#FFEDC7] pb-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
              Verified Students
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Review approved student profiles for industry interface.
            </p>
          </div>

          <div className="bg-white border border-[#FFEDC7] px-6 py-3 rounded-md shadow-sm">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide mr-2">Total Verified</span>
            <span className="text-xl font-bold text-[#EB4C4C]">{students.length}</span>
          </div>
        </header>

        {students.length === 0 ? (
          <div className="bg-white border border-[#FFEDC7] rounded-md shadow-sm p-12 text-center text-gray-500 font-medium text-lg">
            No verified student records found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white border border-[#FFEDC7] rounded-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] leading-tight mb-1">
                        {student.fullName}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm">
                        {student.course} • Year {student.year}
                      </p>
                    </div>

                    <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#FFEDC7] text-[#EB4C4C] whitespace-nowrap">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">PRN Number</span>
                      <span className="text-sm font-bold text-gray-700 font-mono bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 w-max">
                        {student.prn}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Phone</span>
                      <span className="text-sm font-medium text-gray-700">{student.phone}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {student.skills?.length > 0 ? (
                        student.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-md bg-gray-100 text-gray-600"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 font-medium italic">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Bio
                    </span>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {student.bio ? `"${student.bio}"` : "No bio provided."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <a
                    href={student.resumeFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-[#EB4C4C] text-white text-sm font-bold tracking-wide py-3 rounded-md hover:bg-[#FF7070] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Resume
                  </a>

                  <a
                    href={student.collegeIdImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center border-2 border-gray-200 text-gray-600 text-sm font-bold tracking-wide py-3 rounded-md hover:border-gray-300 hover:bg-white transition-all duration-200"
                  >
                    ID Card
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedStudentRequests;