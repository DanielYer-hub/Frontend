import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import "./css/WelcomePage.css";


const WelcomePage: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page-container">

      <main className="welcome-page-content">
        <img src="/content/Forge.jpg" alt="FORGE logo" className="logo" />
      </main>

      <div className="welcome-page-buttons">
        <button
          onClick={() => navigate("/login")}
          className="welcome-page-button login-button"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="welcome-page-button register-button"
        >
          Register
        </button>
      </div>

      <div className="info-text">
        <p>
          Welcome to Forge Your Path (Forge), your ultimate platform for connecting with players worldwide! <br></br>
          Whether you want to find teammates, join matches, or explore new gaming opportunities — Forge has you covered.
        </p>
      </div>

      <footer className="welcome-footer border-top">
        <div className="container py-3 text-center small">
          © {new Date().getFullYear()} Forge Your Path by Daniel Yerema.
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
