import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./QDetailAndAnswerPage.css";
import { UserContext } from "../../App";
import Localaxios from "../../axios/axios";
import Includes from "../../Components/Includes";
import Loading from "../../Components/Loader/Loading";
import Modal from "../../Components/Modal/Modal";

function QDetailnAnswerPage() {
  const { user } = useContext(UserContext);
  const content = useRef(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

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

        const fetchedQuestion = response.data.question[0];
        setQuestion(fetchedQuestion);
        console.log("Question fetched successfully:", fetchedQuestion);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const fetchAnswers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await Localaxios.get(`/answers/all-answers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnswers(response.data.answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [id]);

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
      fetchAnswers();
      content.current.value = "";
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  const handleDelete = async (answerID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await Localaxios.delete(
        `/answers/delete-answer/${answerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Answer deleted successfully:", response);
      fetchAnswers();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleView = async (answerID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await Localaxios.get(
        `/answers/view-answer/${answerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedAnswer(response.data.answer);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error viewing answer:", error);
    }
  };

  const handleUpdate = async (answerID, updatedContent) => {
    try {
      const token = localStorage.getItem("token");
      const response = await Localaxios.put(
        `/answers/edit-answer/${answerID}`,
        {
          content: updatedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Answer updated successfully:", response);
      fetchAnswers();
      setEditingAnswerId(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const truncateDescription = (description, maxLength = 250) => {
    if (!description) return "";

    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + "...";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!question) {
    return <p>Error: Question not found</p>;
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
            {answers.map((answer) => {
              console.log(
                "Answer timestamps:",
                answer.creation_date,
                answer.updated_at
              );
              return (
                <div key={answer.id} className="answer-item">
                  {editingAnswerId === answer.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(answer.id, editedContent);
                      }}
                    >
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="answer-input"
                      ></textarea>
                      <div>
                        <button type="submit" className="answer-button">
                          Update Answer
                        </button>
                        <button
                          type="button"
                          className="answer-button"
                          onClick={() => setEditingAnswerId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>{truncateDescription(answer.content, 300)}</p>
                      <div className="answer-meta">
                        <span>Answered by: {answer.author}</span>
                        <span>
                          {new Date(answer.updated_at).getTime() !==
                          new Date(answer.creation_date).getTime()
                            ? `Answer updated on ${new Date(
                                answer.updated_at
                              ).toLocaleDateString()}`
                            : `Date: ${new Date(
                                answer.creation_date
                              ).toLocaleDateString()}`}
                        </span>
                        <div>
                          <button
                            className="answer-button"
                            onClick={() => handleView(answer.id)}
                          >
                            View Answer
                          </button>
                          {answer.userid === user.userID && (
                            <>
                              <button
                                className="answer-button"
                                onClick={() => {
                                  setEditingAnswerId(answer.id);
                                  setEditedContent(answer.content);
                                }}
                              >
                                Edit Answer
                              </button>
                              <button
                                className="answer-button"
                                onClick={() => handleDelete(answer.id)}
                              >
                                Delete Answer
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <hr />
                </div>
              );
            })}
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

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          answer={selectedAnswer}
        />
      </div>
    </Includes>
  );
}

export default QDetailnAnswerPage;
