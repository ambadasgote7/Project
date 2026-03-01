import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCollegeForm() {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    emailDomain: "",
    description: "",
    courses: []
  });


  /* ================= FETCH EXISTING ================= */

  const fetchCollege = async () => {
    try {

      const res = await API.get(`/admin/colleges/${id}`);

      setForm(res.data?.data);

    } catch (err) {
      console.error(err);
      alert("Failed to load college");
    }
  };

  useEffect(() => {
    if (isEdit) fetchCollege();
  }, [id]);


  /* ================= FORM CHANGE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  /* ================= COURSE ================= */

  const addCourse = () => {

    setForm({
      ...form,
      courses: [
        ...form.courses,
        {
          name: "",
          durationYears: "",
          specializations: []
        }
      ]
    });
  };


  const updateCourse = (index, field, value) => {

    const updated = [...form.courses];

    updated[index][field] = value;

    setForm({
      ...form,
      courses: updated
    });
  };


  const addSpecialization = (index) => {

    const updated = [...form.courses];

    updated[index].specializations.push("");

    setForm({
      ...form,
      courses: updated
    });
  };


  const updateSpecialization = (cIndex, sIndex, value) => {

    const updated = [...form.courses];

    updated[cIndex].specializations[sIndex] = value;

    setForm({
      ...form,
      courses: updated
    });
  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      if (isEdit) {

        await API.put(`/admin/colleges/${id}`, form);

      } else {

        await API.post(`/admin/colleges`, form);

      }

      navigate("/admin/colleges");

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
        {isEdit ? "Edit College" : "Add College"}
      </h2>


      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="College Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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

        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />


        {/* COURSES */}

        <div className="border p-4 rounded">

          <div className="flex justify-between mb-3">

            <h3 className="font-semibold">
              Courses
            </h3>

            <button
              type="button"
              onClick={addCourse}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add Course
            </button>

          </div>


          {form.courses.map((course, index) => (

            <div key={index} className="border p-3 mb-3 rounded">

              <input
                placeholder="Course Name"
                value={course.name}
                onChange={(e) =>
                  updateCourse(index, "name", e.target.value)
                }
                className="w-full border p-2 mb-2 rounded"
              />

              <input
                placeholder="Duration (Years)"
                type="number"
                value={course.durationYears}
                onChange={(e) =>
                  updateCourse(index, "durationYears", e.target.value)
                }
                className="w-full border p-2 mb-2 rounded"
              />


              {/* SPECIALIZATIONS */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Specializations
                  </span>

                  <button
                    type="button"
                    onClick={() => addSpecialization(index)}
                    className="text-blue-600"
                  >
                    + Add
                  </button>

                </div>


                {course.specializations.map((sp, sIndex) => (

                  <input
                    key={sIndex}
                    placeholder="Specialization"
                    value={sp}
                    onChange={(e) =>
                      updateSpecialization(
                        index,
                        sIndex,
                        e.target.value
                      )
                    }
                    className="w-full border p-2 mb-2 rounded"
                  />

                ))}

              </div>

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