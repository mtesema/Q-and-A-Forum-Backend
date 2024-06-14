import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import Includes from "../../Components/Includes";
import "./RegisterPage.css";
import images from "../../Resource/Images";
import About from "../../Components/About/About";
import Register from "./Register";

function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLoginPage = () => {
    navigate("/login");
  };

  return (
    <Includes>
      <div
        style={{
          backgroundImage: `url(${images.bg})`,
         
        }}
        className="register-main-page"
      >
        <div className="register-container">
          <Register />
          <button onClick={handleLoginPage} className="login-link">
            Go to Login
          </button>
        </div>
        <div className="about-container">
          {/* Assuming About component is used similarly */}
          <About />
        </div>
      </div>
    </Includes>
  );
}

export default RegisterPage;
