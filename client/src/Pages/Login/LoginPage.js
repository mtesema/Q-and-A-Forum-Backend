import React from "react";
import Login from "./Login";
import About from "../../Components/About/About";
import "./LoginPage.css";
import images from "../../Resource/Images"; // Assuming you have exported `bg` and `logo` from the Images directory

function LoginPage() {
  return (
    <div
      style={{
        backgroundImage: `url(${images.bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw", 
        height: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
  );
}

export default LoginPage;
