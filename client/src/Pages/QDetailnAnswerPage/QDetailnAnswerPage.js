import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import './QDetailnAnswerPage.css'
import { UserContext } from "../../App";
import Localaxios from "../../axios/axios";
import Includes from "../../Components/Includes";
import Loading from "../../Components/Loader/Loading";

function QDetailnAnswerPage() {
  const { user } = useContext(UserContext);
  console.log("user>>>",user)
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
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
      });
      
        setQuestion(response.data.questions);
        // console.log(response);
      } catch (error) {
        setError(error);
      }
    };
    fetchQuestion();
  }, [user]);

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  if (!question) {
    return <Loading />;
  }

  console.log(question)


  return (
    <Includes>
   
      <div className="question-detail">
        <h1>{question.title}</h1>
        <p>{question.description}</p>
        <div className="question-meta">
          <span>Asked by:{""}{user.userFirstName} </span>
          <span>Date: {new Date(question.date).toLocaleDateString()}</span>
        </div>
        <h2>Comunity Answer</h2>
        <hr />
        {/* Additional details or answers can be added here */}
      </div>
    </Includes>
  );
}

export default QDetailnAnswerPage;
