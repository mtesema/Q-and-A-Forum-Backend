import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import { UserContext } from "../../App";
import Includes from "../../Components/Includes";
import Localaxios from "../../axios/axios";
import Avatar from "@mui/material/Avatar";
import "./Home.css";
import images from "../../Resource/Images";

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;
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
          setQuestions(response.data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };

    fetchQuestions();
  }, [navigate]);

  const truncateDescription = (description, maxLength) => {
    if (!description) return ""; // Handle cases where description is null or undefined

    // Default maxLength if not provided
    maxLength = maxLength || 150;

    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + "...";
    }
  };

  const AllfetchedQuestions = questions.questions || [];

  const renderQuestions = () => {
    if (AllfetchedQuestions.length === 0) {
      return <p>No questions available</p>;
    }
    // Sort questions from latest to oldest
    const sortedQuestions = [...AllfetchedQuestions].reverse();

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = sortedQuestions.slice(
      indexOfFirstQuestion,
      indexOfLastQuestion
    );

   const handleQuestionClick = (questionId) => {
     navigate(`/question-detail/${questionId}`);
   };



    return currentQuestions.map((question) => (
      <div className="question-item" key={question.id}>
        <div className="user-avatar">
          {/* <Avatar>{username.charAt(0)}</Avatar> */}
          <img src={images.avator} alt="" />
          <p>{username}</p>
        </div>
        <div className="question-card">
          <div
            onClick={() => handleQuestionClick(question.id)}
            className="question-card-header"
          >
            <h2>{question.questionid}</h2>
          </div>
          <div className="question-card-body">
            <p>{truncateDescription(question.description)}</p>
          </div>
          <div className="question-card-footer">
            <span className="question-author">Asked by: {username}</span>
            <span className="question-date">
              Date: {new Date(question.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    ));

  };

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(AllfetchedQuestions.length / questionsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    const renderPagination = () => {
      return pageNumbers.map((number) => (
        <button
          key={number}
          className={`pagination-button ${
            currentPage === number ? "active" : ""
          }`}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      ));
    };

  return (
    <Includes>
      <section className="home-main-container">
        <div className="home-screen-header">
          <button onClick={handleAskQuestionPage}>Ask Question</button>
          <h3>Welcome, {userFirstName}!</h3>
        </div>
        <div className="questions-list">{renderQuestions()}</div>
        <div className="pagination">{renderPagination()}</div>
      </section>
    </Includes>
  );
}

export default Home;
