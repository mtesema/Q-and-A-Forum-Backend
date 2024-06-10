import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import localAxios from "../../axios/axios";

function Register() {
  const navigate = useNavigate();
  // Capture user data from DOM
  const userNameDom = useRef(null);
  const firstnameDom = useRef(null);
  const lastnameDom = useRef(null);
  const emailDom = useRef(null);
  const passwordDom = useRef(null);
  const confirmPasswordDom = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username: userNameDom.current.value,
      firstname: firstnameDom.current.value,
      lastname: lastnameDom.current.value,
      email: emailDom.current.value,
      password: passwordDom.current.value,
      confirmPassword: confirmPasswordDom.current.value,
    };

    try {
      await localAxios.post("/users/register", userData);
      // Handle successful registration
      alert("Registration successful, please login with your new credential!");
      navigate("/login");
    } catch (error) {
      console.log("Error:", error.response);
      // Handle error responses from the backend
      alert("Registration failed. Please check the form and try again.");
    }
  };

  return (
    <section className="register-section">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Join the network</h1>
        <h2>
          Already have an account? <Link to="/login">Sign in</Link>
        </h2>
        <div className="form-group">
          <input ref={userNameDom} type="text" placeholder="Username" />
        </div>
        <div className="full-name">
          <div className="form-group">
            <input ref={firstnameDom} type="text" placeholder="First Name" />
          </div>
          <div className="form-group">
            <input ref={lastnameDom} type="text" placeholder="Last Name" />
          </div>
        </div>
        <div className="form-group">
          <input ref={emailDom} type="email" placeholder="Email" />
        </div>
        <div className="form-group">
          <input ref={passwordDom} type="password" placeholder="Password" />
        </div>
        <div className="form-group">
          <input
            ref={confirmPasswordDom}
            type="password"
            placeholder="Confirm Password"
          />
        </div>
        <p>
          I agree to the <Link to="/terms">privacy policy</Link> and{" "}
          <Link to="/terms">terms and conditions</Link>.
        </p>
        <button type="submit">Agree and Join</button>
        <h2>
          <Link to="/login"> Already have an account? </Link>
        </h2>
      </form>
    </section>
  );
}

export default Register;
