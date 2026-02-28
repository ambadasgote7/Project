// pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import API from "../../api/api";
import { addUser } from "../../store/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const redirectByRole = (role) => {
    const r = String(role || "").toLowerCase();

    if (r === "admin") return "/admin";
    if (r === "student") return "/student";
    if (r === "faculty") return "/faculty";
    if (r === "company") return "/company";
    if (r === "mentor") return "/mentor";

    return "/";
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await API.post("/auth/login", form);

    const token =
      res.data?.token ||
      res.data?.data?.token;

    const user =
      res.data?.user ||
      res.data?.data?.user ||
      res.data?.data;

    if (!user) {
      alert("Invalid login response");
      return;
    }

    const profileRes = await API.get("/users/profile");

    console.log("PROFILE RESPONSE:", profileRes.data);

    dispatch(addUser({
      user,
      profile: profileRes.data?.profile,
      token: null // Handled via cookie
    }));

    navigate(redirectByRole(user.role), { replace: true });

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}