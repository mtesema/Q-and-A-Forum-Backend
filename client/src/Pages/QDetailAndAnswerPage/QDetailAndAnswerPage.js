import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./QDetailAndAnswerPage.css";
import { UserContext } from "../../App";
import Localaxios from "../../axios/axios";
import Includes from "../../Components/Includes";
import Loading from "../../Components/Loader/Loading";

function QDetailnAnswerPage() {
  const { user } = useContext(UserContext);
  const content = useRef(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await Localaxios.get(
          `/questions/question-detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedQuestion = response.data.question[0]; // Access the first element of the array
        setQuestion(fetchedQuestion);
        console.log("Question fetched successfully:", fetchedQuestion);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]); // Include id in the dependency array to refetch question when id changes

  // Fetch all answers related to the question
  const fetchAnswers = async () => {
    try {
      console.log("Fetching answers for ID:", id);
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const response = await Localaxios.get(`/answers/all-answers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Answers fetched successfully:", response.data);
      setAnswers(response.data.answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [id]); // Include id in the dependency array to refetch answers when id changes

  console.log("answers", answers.length)
  

  // Post new answer
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await Localaxios.post(
        `/answers/create-answer/${id}`,
        {
          userID: user.userID,
          content: content.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Answer posted successfully:", response);
      fetchAnswers(); // Fetch answers again to update the UI with the latest data

      content.current.value = ""; // Clear the textarea after successful submission
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!question) {
    return <p>Error: Question not found</p>; // Handle case where question is not loaded
  }

  return (
    <Includes>
      <div className="question-detail">
        <div className="question-header">
          <h1>{question.title}</h1>
          <p>{question.description}</p>
          <div className="question-meta">
            <span className="answers-number">{answers.length} Answers</span>
            <div className="question-meta-left">
              <span>Asked by: {question.authorName}</span>
              <span>
                Date: {new Date(question.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="answers-section">
          <h2>Community Answers</h2>
          <hr />

          <div className="answers-list">
            {answers.map((answer) => (
              <div key={answer.id} className="answer-item">
                <p>{answer.content}</p>
                <div className="answer-meta">
                  <span>Answered by: {answer.author}</span>

                  <span>
                    Date: {new Date(answer.creation_date).toLocaleDateString()}
                  </span>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>

        <div className="question-answer">
          <form onSubmit={handleSubmit}>
            <textarea
              name="answer"
              id="answer"
              cols="30"
              rows="10"
              placeholder="Enter your answer here"
              ref={content}
              className="answer-input"
            ></textarea>

            <button type="submit" className="submit-button">
              Post Answer
            </button>
          </form>
        </div>
      </div>
    </Includes>
  );
}

export default QDetailnAnswerPage;
