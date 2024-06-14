const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../Database/DBConfig");

const createAnswer = async (req, res) => {
  const { id } = req.params; // Extract questionid from route params
  const { userID, content } = req.body; // Extract userID and content from request body

  // Validate input fields
  if (!userID || !content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide userID and content",
    });
  }

  try {
    // Insert answer data into the database (assuming answerid is auto-incremented)
    const insertAnswerQuery =
      "INSERT INTO answers (userid, questionid, content) VALUES (?, ?, ?)";
    const values = [userID, id, content];
    const [result] = await dbConnection.query(insertAnswerQuery, values);

    console.log("Database query result:", result);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer created successfully" });
  } catch (error) {
    console.error("Error creating answer:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create answer" });
  }
};

module.exports = { createAnswer };
