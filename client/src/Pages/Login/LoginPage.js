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
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh", 
          width: "100%", 
          display: "flex",
          alignItems: "center", // Optional: Center content vertically
          justifyContent: "center", // Optional: Center content horizontally
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
