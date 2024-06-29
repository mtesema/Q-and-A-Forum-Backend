const {
  StatusCodes
} = require("http-status-codes");
const dbConnection = require("../Database/DBConfig");

//Creating question
const createQuestion = async (req, res) => {
  const {
    questionid,
    description
  } = req.body;
  const {
    userID
  } = req.user; // Extract userID from req.user

  // Validate input fields
  if (!questionid || !description || !userID) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide full information"
    });
  }
  try {
    // Insert question data into the database
    const insertQuestionQuery = "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)";
    const values = [questionid, userID, questionid, description]; // Include title as questionid
    const [result] = await dbConnection.query(insertQuestionQuery, values);
    console.log("Database query result:", result); // Log the result to see what is returned

    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully"
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create question"
    });
  }
};

// Get all questions with associated user names
const getQuestions = async (req, res) => {
  try {
    // Get all questions with user names and answer counts
    const getQuestionsQuery = `
      SELECT q.*, u.username,
      (SELECT COUNT(*) FROM answers a WHERE a.questionid = q.id) AS answerCount
      FROM questions q
      INNER JOIN users u ON q.userID = u.userid
    `;
    const [questions] = await dbConnection.query(getQuestionsQuery);
    console.log("Database query result:", questions); // Log the result to see what is returned

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No questions found"
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Questions fetched successfully",
      questions
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch questions"
    });
  }
};

// Get a single question with the username of the author
const getQuestion = async (req, res) => {
  const {
    id
  } = req.params; // Assuming the question id is passed as a route parameter

  try {
    // Get question with author username
    const getQuestionQuery = `
      SELECT q.*, u.username AS authorName
      FROM questions q
      INNER JOIN users u ON q.userID = u.userid
      WHERE q.id = ?
    `;
    const [question] = await dbConnection.query(getQuestionQuery, [id]);
    console.log("Database query result:", question); // Log the result to see what is returned

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found"
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Question fetched successfully",
      question
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch question"
    });
  }
};

//filter all questions per user to display on user profile
const getuesrQuestions = async (req, res) => {
  const {
    userID
  } = req.user; // Extract userID from req.user

  try {
    // Check if user exists
    const checkUserQuery = "SELECT * FROM users WHERE userid = ?";
    const [users] = await dbConnection.query(checkUserQuery, [userID]);
    console.log("Database query result:", users); // Log the result to see what is returned

    if (users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
    }

    // Get all questions
    const getQuestionsQuery = "SELECT * FROM questions WHERE userid = ?";
    const [questions] = await dbConnection.query(getQuestionsQuery, [userID]);
    console.log("Database query result:", questions); // Log the result to see what is returned

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No questions found"
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Questions fetched successfully",
      questions
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch questions"
    });
  }
};
const putIncrement = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    // Increment views count in the database
    const incrementViewsQuery = `
      UPDATE questions
      SET views = views + 1
      WHERE id = ?
    `;
    const [result] = await dbConnection.query(incrementViewsQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Question not found"
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Views incremented successfully"
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error"
    });
  }
};

//DELETE QUESTION 

const deleteQuestion = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    // Check if there are dependent rows in answers table
    const checkAnswersQuery = "SELECT * FROM answers WHERE questionid = ?";
    const [answers] = await dbConnection.query(checkAnswersQuery, [id]);

    // If there are answers related to the question, handle them first
    if (answers.length > 0) {
      // Option 1: Delete answers related to the question
      const deleteAnswersQuery = "DELETE FROM answers WHERE questionid = ?";
      await dbConnection.query(deleteAnswersQuery, [id]);

      // Option 2: Update answers to remove the question reference (if applicable)
      // const updateAnswersQuery = 'UPDATE answers SET questionid = NULL WHERE questionid = ?';
      // await dbConnection.query(updateAnswersQuery, [id]);
    }

    // Now delete the question
    const deleteQuestionQuery = "DELETE FROM questions WHERE id = ?";
    const [result] = await dbConnection.query(deleteQuestionQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found"
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Question deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete question"
    });
  }
};
module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  getuesrQuestions,
  putIncrement,
  deleteQuestion
};