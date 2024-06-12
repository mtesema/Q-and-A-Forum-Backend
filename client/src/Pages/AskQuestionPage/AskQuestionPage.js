import React, { useState, useContext } from "react";
import "./AskQuestionPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios/axios"; // Assuming correct Axios import path
import Includes from "../../Components/Includes";
import Loading from "../../Components/Loader/Loading"; // Assuming you have a Loading component
import { UserContext } from "../../App";

function QuestionForm() {
  const { user } = useContext(UserContext);
  const userId = user.userID; // Assuming user object has userID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionid: "", // Use the correct property name
    description: "",
    userId: userId, // Include userId in formData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formData.questionid || !formData.description) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Check if token is available

      const response = await axios.post("/questions/ask-questions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Navigate to home page after a delay
      }, 2000); // 2-second delay
    } catch (error) {
      console.error("Error posting question:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Navigate to home page after a delay even if there's an error
      }, 500); // 1-second delay
    }
  };

  return (
    <Includes>
      {loading && <Loading />}
      <div className="question-form">
        <div className="question-help">
          <p className="help-text">Steps to write a good question:</p>
          <ul className="help-list">
            <li>Summarize your problem in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Explain what you've tried and expected outcomes.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
        </div>

        <div className="form-container">
          <h1 className="form-title">Ask a Question</h1>
          <Link to="/all-questions" className="form-link">
            <p className="link-text">Go to Questions page</p>
          </Link>

          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="questionid"
              placeholder="Title"
              className="input-field"
              value={formData.questionid}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Question Description"
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <button type="submit" className="submit-button" disabled={loading}>
              Ask Question
            </button>
          </form>
        </div>
      </div>
    </Includes>
  );
}

export default QuestionForm;
