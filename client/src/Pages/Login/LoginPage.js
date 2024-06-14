import React from "react";
import images from "../../Resource/Images";
import Login from "./Login";
import About from "../../Components/About/About";
import "./LoginPage.css"; 
import Includes from "../../Components/Includes";

function LoginPage() {
  return (
    <Includes>
      <div
        style={{
          backgroundImage: `url(${images.bg})`,
      
        }}
        className="login-main-page"
      >
        <div className="login-container">
          <Login />
        </div>
        <div className="about-container">
          <About />
        </div>
      </div>
    </Includes>
  );
}

export default LoginPage;
