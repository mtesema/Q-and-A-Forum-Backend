import React, { useContext, useEffect, useState } from "react";
import Includes from "../../Components/Includes";
import { UserContext } from "../../App";
import Localaxios from "../../axios/axios";
import "./UserProfile.css"; // Import your CSS file for styling
import images from "../../Resource/Images"; // Assuming you have an images file
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await Localaxios.get("/questions/user-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user]);

  const handleQuestionClick = (questionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      navigate(`/question-detail/${questionId}`);
    } catch (error) {
      console.error("Error counting question view:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return "";
    return description.length <= maxLength
      ? description
      : `${description.substring(0, maxLength)}...`;
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching questions: {error.message}</p>;
  }

  return (
    <Includes>
      <div className="user-profile-container">
        <h1>User Profile</h1>

        <div className="user-info">
          <div>
            <img src={images.avatar} alt="Profile" className="profile-img" />
          </div>
          <div className="user-details">
            <p>Hi {user.userFirstName}</p>
            <p>User Name: {user.userName}</p>
            <p>UserID: {user.userID}</p>
          </div>
        </div>

        <h2>Your Questions</h2>
        <div className="questions-list">
          {questions.length === 0 ? (
            <p>No questions available</p>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                onClick={() => handleQuestionClick(question.id)}
                className="question-item"
              >
                <h3>{question.title}</h3>
                <p>{truncateDescription(question.description)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Includes>
  );
}

export default UserProfile;
