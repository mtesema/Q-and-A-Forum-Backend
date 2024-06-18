import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import { UserContext } from "../../App";
import Includes from "../../Components/Includes";
import Localaxios from "../../axios/axios";
import "./Home.css";
import images from "../../Resource/Images";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search"; // Importing the search icon
import Loading from "../../Components/Loader/Loading"; // Import your loading component

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [loadingQuestionId, setLoadingQuestionId] = useState(""); // State for loading individual question
  const { user } = useContext(UserContext);
  const username = user ? user.userName : "Guest";
  const userFirstName = user ? user.userFirstName : "Guest";

  const handleAskQuestionPage = () => {
    navigate("/ask-questions");
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return "";

    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + "...";
    }
  };

  // Function to fetch questions from server
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
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []); // Fetch questions on component mount

  const handleDeleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await Localaxios.delete(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful deletion, fetch updated questions from server
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleQuestionsPerPageChange = (event) => {
    setQuestionsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

const handleQuestionClick = async (questionId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingQuestionId(questionId); // Set loading state for individual question

    // Simulate delay for loading effect
    await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay time as needed

    await Localaxios.put(`/questions/increment/${questionId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLoadingQuestionId(""); // Disable loading state after successful fetch

    navigate(`/question-detail/${questionId}`);
  } catch (error) {
    console.error("Error counting question view:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    setLoadingQuestionId(""); // Ensure loading state is disabled on error
  }
};

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderQuestions = () => {
    if (filteredQuestions.length === 0) {
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
              <div>
                <span className="question-author">
                  Asked by: {question.username}
                </span>
                <span className="question-date">
                  Date: {new Date(question.created_at).toLocaleDateString()}
                </span>
              </div>
              {user && user.userID === question.userid && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const pageNumbers = Math.ceil(filteredQuestions.length / questionsPerPage);

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

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon
            className="search-icon"
            onClick={() => setSearchQuery(searchQuery)}
            sx={{ cursor: "pointer" }}
            fill="none"
            fontSize="small"
            color="F78402"
          />
        </div>
        <div className="questions-list">{renderQuestions()}</div>
        <div className="pagination">{renderPagination()}</div>

        {/* Loading indicator for individual question */}
        {loadingQuestionId && (
          <div className="loading-overlay">
            <Loading />
          </div>
        )}
      </section>
    </Includes>
  );
}

export default Home;
