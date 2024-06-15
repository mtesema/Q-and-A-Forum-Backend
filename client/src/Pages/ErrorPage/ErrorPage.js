import React from "react";
import "./ErrorPage.css"; // Import CSS file for styling
import Includes from "../../Components/Includes";
import images from "../../Resource/Images";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleLinkClick = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <Includes>
      <div className="error-container">
        <div className="error-content">
          <img src={images.errorImage} alt="Error" className="error-image" />
          <h2>Oops! Something went wrong.</h2>
          <p>We apologize for the inconvenience.</p>
          <p>Please try again later or contact support.</p>
          <button onClick={handleLinkClick} className="error-button">
            Go to Homepage
          </button>
        </div>
      </div>
    </Includes>
  );
};

export default ErrorPage;
