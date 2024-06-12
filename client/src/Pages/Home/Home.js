import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import Includes from "../../Components/Includes";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Destructure user from context
  const userFirstName = user ? user.userFirstName : "Guest"; // Use userName from user data or fallback to "Guest"

  const handleAskQuestionPage = () => {
    navigate("/ask-questions");
  };

  return (
    <Includes>
      <section className="home-main-container">
        <div className="home-screen-header">
          <button onClick={handleAskQuestionPage}>Ask Question</button>
          <h3>Welcome, {userFirstName}!</h3>
        </div>
      </section>
    </Includes>
  );
}

export default Home;
