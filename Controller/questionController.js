const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../Database/DBConfig");

//Creating question 
const createQuestion = async (req, res) => {
  const { questionid, description } = req.body;
  const { userID } = req.user; // Extract userID from req.user

  // Validate input fields
  if (!questionid || !description || !userID) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide full information" });
  }

  try {
    // Insert question data into the database
    const insertQuestionQuery =
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)";
    const values = [questionid, userID, questionid, description]; // Include title as questionid
    const [result] = await dbConnection.query(insertQuestionQuery, values);

    console.log("Database query result:", result); // Log the result to see what is returned

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question created successfully" });
  } catch (error) {
    console.error("Error creating question:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create question" });
  }
};

//Get all questions
const getQuestions = async (req, res) => {
  const { userID } = req.user; // Extract userID from req.user

  try {
    // Check if user exists
    const checkUserQuery = "SELECT * FROM users WHERE userid = ?";
    const [users] = await dbConnection.query(checkUserQuery, [userID]);

    console.log("Database query result:", users); // Log the result to see what is returned

    if (users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Get all questions    
    const getQuestionsQuery = "SELECT * FROM questions WHERE userid = ?";
    const [questions] = await dbConnection.query(getQuestionsQuery, [userID]);

    console.log("Database query result:", questions); // Log the result to see what is returned

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No questions found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Questions fetched successfully", questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch questions" });
  }
};


const getQuestion = async (req, res) => {
  const { id } = req.params;
  console.log("Question ID:", id); // Log the id

  try {
    // Check if question exists
    const checkQuestionQuery = "SELECT * FROM questions WHERE id = ?";
    const [questions] = await dbConnection.query(checkQuestionQuery, [id]);

    console.log("Database query result:", questions); // Log the result to see what is returned

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    return res.status(StatusCodes.OK).json({
      message: "Question fetched successfully",
      questions: questions[0],
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch question" });
  }
};



module.exports = { createQuestion, getQuestions, getQuestion };


