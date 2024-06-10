import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import your unique CSS file for Login
import localAxios from "../../axios/axios";

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [identifierBgColor, setIdentifierBgColor] = useState("input-blue");
  const [passwordBgColor, setPasswordBgColor] = useState("input-blue");

  const identifierDom = useRef(null);
  const passwordDom = useRef(null);

  const handleIdentifierChange = () => {
    setIdentifierBgColor("input-blue");
    setErrorMessage("");
  };

  const handlePasswordFocus = () => {
    if (!identifierDom.current.value) {
      setErrorMessage(
        "Please enter your email or username before entering your password."
      );
      setIdentifierBgColor("input-red");
      passwordDom.current.blur();
    }
  };

  const handlePasswordChange = () => {
    setPasswordBgColor("input-blue");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const identifierValue = identifierDom.current.value;
    const userData = {
      password: passwordDom.current.value,
    };

    // Validate input fields
    if (identifierValue.includes("@")) {
      userData.email = identifierValue;
    } else {
      userData.username = identifierValue;
    }

    if ((!userData.email && !userData.username) || !userData.password) {
      setErrorMessage("Please provide all the required info.");
      setIdentifierBgColor("input-red");
      setPasswordBgColor("input-red");
      return;
    }

    try {
      const response = await localAxios.post("/users/login", userData);
      const { data } = response;
      // Save token to localStorage
      localStorage.setItem("token", data.token);
      
      navigate("/"); // Redirect to home page or any other route

      console.log("Data:", data);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setErrorMessage(errorMsg);
      setIdentifierBgColor("input-red");
      setPasswordBgColor("input-red");
      console.log("Error:", errorMsg);
    }
  };

  return (
    <section className="login-section">
      <form className="login-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="login-header">
          <h5 className="login-title">Login to your account</h5>
          <p className="login-subtitle">
            Don't have an account?{" "}
            <Link to="/register">Create a new account</Link>
          </p>
        </div>

        <div className="login-form-group">
          <input
            ref={identifierDom}
            type="text"
            placeholder="Email address or Username"
            className={identifierBgColor}
            onChange={handleIdentifierChange}
          />
        </div>
        <div className="login-form-group">
          <input
            ref={passwordDom}
            type="password"
            placeholder="Password"
            className={passwordBgColor}
            onFocus={handlePasswordFocus}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="forgot-password">
          <Link to="/terms">Forgot password?</Link>
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default Login;
