import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import API from "../../api/api";

const STORAGE_KEY = "invite_students_state";

export default function InviteStudent() {
  const currentUser = useSelector((state) => state.user.user);
  const profile = useSelector((state) => state.user.profile);

  const isFaculty = currentUser?.role === "faculty";

  // ================= STATE =================

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const hasRestored = useRef(false);

  const [form, setForm] = useState({
    courseName: "",
    specialization: "",
    courseStartYear: "",
    courseEndYear: "",
    academicYear: "",
  });

  const [mode, setMode] = useState("count");
  const [count, setCount] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState({
    total: 0,
    sent: 0,
    success: 0,
    failed: 0,
  });

  const [fileName, setFileName] = useState("");

  // ================= YEAR WORDS =================

  const yearToWords = (year) => {
    const map = {
      2020: "Two Thousand Twenty",
      2021: "Two Thousand Twenty One",
      2022: "Two Thousand Twenty Two",
      2023: "Two Thousand Twenty Three",
      2024: "Two Thousand Twenty Four",
      2025: "Two Thousand Twenty Five",
      2026: "Two Thousand Twenty Six",
      2027: "Two Thousand Twenty Seven",
      2028: "Two Thousand Twenty Eight",
      2029: "Two Thousand Twenty Nine",
      2030: "Two Thousand Thirty",
    };
    return map[year] || year;
  };

  const startYearOptions = Array.from({ length: 11 }).map((_, i) => 2020 + i);

  const selectedCourse = courses.find((c) => c.name === form.courseName);
  const duration = selectedCourse?.duration || 4;

  const academicYearOptions = Array.from({ length: duration }, (_, i) => i + 1);

  // ================= VALIDATION =================

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateRows = (data) => {
    const seen = new Set();

    return data.map((row) => {
      const errors = {};
      const email = row.email?.trim() || "";
      const fullName = row.fullName?.trim() || "";

      if (!email) errors.email = "Email is required";
      else if (!isValidEmail(email)) errors.email = "Invalid email address";

      if (!fullName) errors.fullName = "Full name is required";

      if (email) {
        const lower = email.toLowerCase();
        if (seen.has(lower)) errors.email = "Duplicate email";
        else seen.add(lower);
      }

      return { email, fullName, errors };
    });
  };

  // ================= LOAD COURSES =================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCoursesLoaded(true);
    }
  };

  // ================= RESTORE (runs once after courses load) =================

  useEffect(() => {
    if (!coursesLoaded || hasRestored.current) return;
    hasRestored.current = true;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setForm(parsed.form || {});
      setRows(parsed.rows || []);
      setMode(parsed.mode || "count");
      setCount(parsed.count || "");
      setFileName(parsed.fileName || "");
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [coursesLoaded]);

  // ================= SAVE =================

  useEffect(() => {
    if (!hasRestored.current) return;

    const data = { rows, form, mode, count, fileName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [rows, form, mode, count, fileName]);

  // ================= SPECIALIZATION =================

  useEffect(() => {
    if (!form.courseName) return;
    const selected = courses.find((c) => c.name === form.courseName);
    setSpecializations(selected?.specializations || []);
  }, [form.courseName, courses]);

  // ================= FACULTY AUTO =================

  useEffect(() => {
    if (isFaculty && profile && !form.courseName) {
      setForm((prev) => ({
        ...prev,
        courseName: profile.courseName || "",
        specialization: profile.department || "",
      }));
    }
  }, [isFaculty, profile]);

  // ================= HANDLERS =================

  const handleCourseChange = (courseName) => {
    const selected = courses.find((c) => c.name === courseName);
    setForm((prev) => ({
      ...prev,
      courseName,
      specialization: "",
      courseStartYear: "",
      courseEndYear: "",
      academicYear: "",
    }));
    setSpecializations(selected?.specializations || []);
  };

  const handleStartYearChange = (year) => {
    const start = Number(year);
    const end = start + duration;
    setForm((prev) => ({
      ...prev,
      courseStartYear: start,
      courseEndYear: end,
    }));
  };

  const generateRows = () => {
    const num = Number(count);
    if (!num || num <= 0) return;
    const arr = Array.from({ length: num }, () => ({ email: "", fullName: "" }));
    setRows(validateRows(arr));
  };

  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    setRows(validateRows(updated));
  };

  const removeRow = (i) => {
    const updated = rows.filter((_, idx) => idx !== i);
    setRows(validateRows(updated));
  };

  // ================= CSV =================

  const downloadTemplate = () => {
    const csv = "email,full name\nexample@gmail.com,John Doe";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_invite_template.csv";
    link.click();
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        const formatted = results.data.map((r) => ({
          email: r.email || "",
          fullName: r["full name"] || r.fullname || r.name || "",
        }));
        setRows(validateRows(formatted));
      },
    });
  };

  const removeFile = () => {
    setRows([]);
    setFileName("");
  };

  // ================= SUBMIT =================

  const submitBulk = async () => {
    const academicYear = parseInt(form.academicYear, 10);
    const courseStartYear = parseInt(form.courseStartYear, 10);
    const courseEndYear = parseInt(form.courseEndYear, 10);

    if (!form.courseName) {
      alert("Please select a course");
      return;
    }
    if (!courseStartYear || isNaN(courseStartYear)) {
      alert("Please select a course start year");
      return;
    }
    if (!academicYear || isNaN(academicYear) || academicYear <= 0) {
      alert("Please select an academic year");
      return;
    }

    const hasErrors = rows.some((r) => Object.keys(r.errors || {}).length > 0);
    if (hasErrors) {
      alert("Fix all row errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const payload = rows.map((r) => ({
        email: r.email.trim(),
        fullName: r.fullName.trim(),
        courseName: form.courseName,
        specialization: form.specialization || undefined,
        courseStartYear,
        courseEndYear,
        academicYear,
      }));

      setProgress({
        total: payload.length,
        sent: payload.length,
        success: 0,
        failed: 0,
      });

      const res = await API.post("/users/student/invite", payload);

      const successCount = res.data?.successCount || payload.length;
      const failedCount = payload.length - successCount;

      setProgress((prev) => ({
        ...prev,
        success: successCount,
        failed: failedCount,
      }));

      alert("Invite completed");

      setRows([]);
      setCount("");
      setFileName("");
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      alert(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  const errorRows = rows.filter((r) => Object.keys(r.errors || {}).length > 0).length;

  const progressPercent =
    progress.total === 0
      ? 0
      : Math.round((progress.success / progress.total) * 100);

  // ================= STYLES =================

  const styles = {
    container: {
      padding: 30,
      maxWidth: 960,
      margin: "auto",
      fontFamily: "'Segoe UI', sans-serif",
    },
    inputGroup: {
      display: "flex",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap",
    },
    select: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14,
      minWidth: 160,
    },
    input: {
      padding: "7px 10px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 13,
      width: "100%",
      boxSizing: "border-box",
    },
    inputError: {
      border: "1px solid #e53e3e",
    },
    errorMsg: {
      color: "#e53e3e",
      fontSize: 11,
      marginTop: 3,
    },
    btn: {
      padding: "8px 16px",
      borderRadius: 6,
      border: "none",
      background: "#3b82f6",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 500,
    },
    btnSecondary: {
      padding: "8px 16px",
      borderRadius: 6,
      border: "1px solid #ccc",
      background: "#f9f9f9",
      cursor: "pointer",
      fontSize: 13,
    },
    btnDanger: {
      padding: "4px 8px",
      borderRadius: 6,
      border: "none",
      background: "transparent",
      color: "#e53e3e",
      cursor: "pointer",
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 1,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 16,
    },
    th: {
      textAlign: "left",
      padding: "8px 10px",
      background: "#f3f4f6",
      fontSize: 13,
      fontWeight: 600,
      borderBottom: "1px solid #e5e7eb",
    },
    td: {
      padding: "6px 10px",
      verticalAlign: "top",
      borderBottom: "1px solid #f0f0f0",
    },
    errorBanner: {
      background: "#fff5f5",
      border: "1px solid #fed7d7",
      color: "#c53030",
      padding: "8px 14px",
      borderRadius: 6,
      marginBottom: 12,
      fontSize: 13,
    },
    progressBox: {
      marginTop: 20,
      padding: 16,
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: 8,
      fontSize: 14,
    },
  };

  // ================= UI =================

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: 24 }}>Invite Students</h2>

      {/* COURSE */}
      <div style={styles.inputGroup}>
        {isFaculty ? (
          <>
            <input style={styles.input} value={form.courseName} disabled />
            <input style={styles.input} value={form.specialization} disabled />
          </>
        ) : (
          <>
            <select
              style={styles.select}
              value={form.courseName}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={form.specialization}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, specialization: e.target.value }))
              }
              disabled={!form.courseName}
            >
              <option value="">Select Specialization</option>
              {specializations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* YEARS */}
      <div style={styles.inputGroup}>
        <select
          style={styles.select}
          value={form.courseStartYear}
          onChange={(e) => handleStartYearChange(e.target.value)}
        >
          <option value="">Start Year</option>
          {startYearOptions.map((y) => (
            <option key={y} value={y}>
              {y} ({yearToWords(y)})
            </option>
          ))}
        </select>

        <select style={styles.select} value={form.courseEndYear} disabled>
          <option value="">End Year</option>
          {form.courseEndYear && (
            <option value={form.courseEndYear}>{form.courseEndYear}</option>
          )}
        </select>

        <select
          style={styles.select}
          value={form.academicYear}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, academicYear: e.target.value }))
          }
        >
          <option value="">Academic Year</option>
          {academicYearOptions.map((y) => (
            <option key={y} value={y}>
              {y} Year
            </option>
          ))}
        </select>
      </div>

      {/* MODE */}
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <button
          style={{
            ...styles.btn,
            background: mode === "count" ? "#3b82f6" : "#e5e7eb",
            color: mode === "count" ? "#fff" : "#374151",
          }}
          onClick={() => setMode("count")}
        >
          Count Mode
        </button>
        <button
          style={{
            ...styles.btn,
            background: mode === "csv" ? "#3b82f6" : "#e5e7eb",
            color: mode === "csv" ? "#fff" : "#374151",
          }}
          onClick={() => setMode("csv")}
        >
          CSV Mode
        </button>
      </div>

      {/* CSV */}
      {mode === "csv" && (
        <div style={{ marginBottom: 20 }}>
          <button style={styles.btnSecondary} onClick={downloadTemplate}>
            ⬇ Download Template
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSV}
            style={{ marginLeft: 10 }}
          />
          {fileName && (
            <div style={{ marginTop: 10, fontSize: 13, color: "#374151" }}>
              📄 {fileName}
              <button
                onClick={removeFile}
                style={{ ...styles.btnDanger, marginLeft: 8 }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* COUNT */}
      {mode === "count" && (
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <input
            style={{ ...styles.input, width: 200 }}
            type="number"
            placeholder="Number of students"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          <button style={styles.btn} onClick={generateRows}>
            Generate
          </button>
        </div>
      )}

      {/* ERROR BANNER */}
      {errorRows > 0 && (
        <div style={styles.errorBanner}>
          ⚠ {errorRows} row{errorRows > 1 ? "s" : ""} contain errors. Fix them
          before submitting.
        </div>
      )}

      {/* TABLE */}
      {rows.length > 0 && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: 40 }}>#</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Full Name</th>
                <th style={{ ...styles.th, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, color: "#9ca3af", fontSize: 13 }}>
                    {i + 1}
                  </td>

                  <td style={styles.td}>
                    <input
                      style={{
                        ...styles.input,
                        ...(row.errors?.email ? styles.inputError : {}),
                      }}
                      value={row.email}
                      onChange={(e) => updateRow(i, "email", e.target.value)}
                      placeholder="student@email.com"
                    />
                    {row.errors?.email && (
                      <div style={styles.errorMsg}>⚠ {row.errors.email}</div>
                    )}
                  </td>

                  <td style={styles.td}>
                    <input
                      style={{
                        ...styles.input,
                        ...(row.errors?.fullName ? styles.inputError : {}),
                      }}
                      value={row.fullName}
                      onChange={(e) => updateRow(i, "fullName", e.target.value)}
                      placeholder="Full Name"
                    />
                    {row.errors?.fullName && (
                      <div style={styles.errorMsg}>⚠ {row.errors.fullName}</div>
                    )}
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.btnDanger}
                      onClick={() => removeRow(i)}
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button
              style={{
                ...styles.btn,
                opacity: loading || errorRows > 0 ? 0.5 : 1,
                cursor: loading || errorRows > 0 ? "not-allowed" : "pointer",
              }}
              onClick={submitBulk}
              disabled={loading || errorRows > 0}
            >
              {loading ? "Inviting..." : `Invite ${rows.length} Student${rows.length > 1 ? "s" : ""}`}
            </button>
          </div>
        </>
      )}

      {/* PROGRESS */}
      {progress.total > 0 && (
        <div style={styles.progressBox}>
          <div>
            <strong>Total:</strong> {progress.total}
          </div>
          <div style={{ color: "#16a34a" }}>
            <strong>Success:</strong> {progress.success}
          </div>
          <div style={{ color: "#dc2626" }}>
            <strong>Failed:</strong> {progress.failed}
          </div>
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                height: 8,
                background: "#d1fae5",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background: "#22c55e",
                  transition: "width 0.4s",
                }}
              />
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
              {progressPercent}% complete
            </div>
          </div>
        </div>
      )}
    </div>
  );
}