import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <div className="home">

      {/* HERO */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            Internship Management Simplified
          </h1>

          <p className="home__subtitle">
            A unified platform connecting Colleges, Students, Companies,
            Mentors, and Faculty to manage the complete internship lifecycle —
            from onboarding to completion.
          </p>

          <div className="home__actions">
  <button
    className="home__btn home__btn--primary"
    onClick={() => navigate("/login")}
  >
    Login
  </button>

  <button
    className="home__btn home__btn--secondary"
    onClick={() => navigate("/college/register")}
  >
    Register College
  </button>

  <button
    className="home__btn home__btn--secondary"
    onClick={() => navigate("/company/register")}
  >
    Register Company
  </button>
</div>
        </div>
      </section>

      {/* OTHER SECTIONS SAME AS YOUR CODE */}

    </div>
  );
}