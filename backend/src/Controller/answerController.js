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




const getAnswers = async (req, res) => {
  const { id } = req.params; // Extract questionid from route params

  try {
    const getAnswerQuery = `
      SELECT answers.*, users.username AS author 
      FROM answers 
      JOIN users ON answers.userid = users.userid 
      WHERE answers.questionid = ?
    `;
    const [answers] = await dbConnection.query(getAnswerQuery, [id]);

    console.log("Database query result:", answers);
    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch answers" });
  }
};

// delete answer 
const deleteAnswer = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteAnswerQuery = "DELETE FROM answers WHERE id = ?";
    const [result] = await dbConnection.query(deleteAnswerQuery, [id]);

    console.log("Database query result:", result);

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Answer not found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete answer" });
  }
};

//view answer
const viewAnswer = async (req, res) => {
  const { id } = req.params;

  try {
    const viewAnswerQuery = `
      SELECT answers.*, users.username as authorName 
      FROM answers 
      JOIN users ON answers.userid = users.userid 
      WHERE answers.id = ?
    `;
    const [rows] = await dbConnection.query(viewAnswerQuery, [id]);

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Answer not found" });
    }

    const answer = rows[0];
    return res.status(StatusCodes.OK).json({ answer });
  } catch (error) {
    console.error("Error viewing answer:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to view answer" });
  }
};

module.exports = viewAnswer;

// update answer
// update answer
const updateAnswer = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Fetch the current answer content to compare with the updated content
    const selectAnswerQuery = "SELECT * FROM answers WHERE id = ?";
    const [rows] = await dbConnection.query(selectAnswerQuery, [id]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Answer not found" });
    }

    const currentAnswer = rows[0];

    // Only update the content and updated_at if the content has actually changed
    if (currentAnswer.content !== content) {
      const updateAnswerQuery = "UPDATE answers SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
      const [result] = await dbConnection.query(updateAnswerQuery, [content, id]);

      if (result.affectedRows === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Answer not found" });
      }
    }

    // Fetch the updated answer from the database
    const updatedSelectAnswerQuery = "SELECT * FROM answers WHERE id = ?";
    const [updatedRows] = await dbConnection.query(updatedSelectAnswerQuery, [id]);

    if (updatedRows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Answer not found" });
    }

    const updatedAnswer = updatedRows[0];

    return res.status(StatusCodes.OK).json({ message: "Answer updated successfully", answer: updatedAnswer });
  } catch (error) {
    console.error("Error updating answer:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to update answer" });
  }
};

const putIncrement = async (req, res) => {
  const { id } = req.params;

  try {
    // Increment views count in the database
    const incrementViewsQuery = `
      UPDATE answers
      SET views = views + 1
      WHERE id = ?
    `;
    const [result] = await dbConnection.query(incrementViewsQuery, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Answer not found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Views incremented successfully" });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


module.exports = { createAnswer, 
  getAnswers,
  deleteAnswer,
  viewAnswer,
  updateAnswer,
  putIncrement };  // Exporting all the functions

