import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import { UserContext } from "../../App";
import Includes from "../../Components/Includes";
import Localaxios from "../../axios/axios";
import "./Home.css";
import images from "../../Resource/Images";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(3);
  const { user } = useContext(UserContext);
  const username = user ? user.userName : "Guest";
  const userFirstName = user ? user.userFirstName : "Guest";

  const handleAskQuestionPage = () => {
    navigate("/ask-questions");
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await Localaxios.get("/questions/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === StatusCodes.OK) {
          setQuestions(response.data.questions);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
        // Handle errors: Display a message to the user or retry fetching questions
      }
    };

    fetchQuestions();
  }, [navigate]);

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return ""; // Handle cases where description is null or undefined

    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + "...";
    }
  };

  const handleQuestionsPerPageChange = (event) => {
    setQuestionsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when the number of questions per page changes
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await Localaxios.put(`/questions/increment/${questionId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect to the question detail page
      navigate(`/question-detail/${questionId}`);
    } catch (error) {
      console.error("Error counting question view:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const renderQuestions = () => {
    if (questions.length === 0) {
      return <p>No questions available</p>;
    }

    const sortedQuestions = [...questions].reverse();
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = sortedQuestions.slice(
      indexOfFirstQuestion,
      indexOfLastQuestion
    );

    return currentQuestions.map((question) => (
      <div className="question-item" key={question.id}>
        <div className="user-avatar">
          <img src={images.avatar} alt="" />
          <p>{question.username}</p>
        </div>
        <div className="question-card">
          <div
            onClick={() => handleQuestionClick(question.id)}
            className="question-card-header"
          >
            <h2>{question.title}</h2>
          </div>
          <div className="question-card-body">
            <p>{truncateDescription(question.description)}</p>
          </div>
          <div className="question-card-footer">
            <div className="question-card-footer-right">
              <div
                onClick={() => handleQuestionClick(question.id)}
                className="question-answers"
              >
                Answers: {question.answerCount}
              </div>
              <div className="views-count">
                <div className="icon">
                  <VisibilityIcon
                    fill="none"
                    fontSize="small"
                    color="F78402"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleQuestionClick(question.id)}
                  />
                </div>
                <div className="count">{question.views}k Views</div>
              </div>
            </div>
            <div className="question-card-footer-left">
              <span className="question-author">
                Asked by: {question.username}
              </span>
              <span className="question-date">
                Date: {new Date(question.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const pageNumbers = Math.ceil(questions.length / questionsPerPage);

  const renderPagination = () => {
    return Array.from({ length: pageNumbers }, (_, index) => index + 1).map(
      (number) => (
        <button
          key={number}
          className={`pagination-button ${
            currentPage === number ? "active" : ""
          }`}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      )
    );
  };

  return (
    <Includes>
      <section className="home-main-container">
        <div className="home-screen-header">
          <button onClick={handleAskQuestionPage}>Ask Question</button>
          <h3>Welcome, {userFirstName}!</h3>
          <label>
            Questions per page:
            <select
              value={questionsPerPage}
              onChange={handleQuestionsPerPageChange}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
        <div className="questions-list">{renderQuestions()}</div>
        <div className="pagination">{renderPagination()}</div>
      </section>
    </Includes>
  );
}

export default Home;
