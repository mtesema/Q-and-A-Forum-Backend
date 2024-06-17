const express = require("express");
const router = express.Router();

// Authentication middleware
const authMiddleWare = require("../MiddleWare/authMiddleWare");
const {
  createAnswer,
  getAnswers,
  deleteAnswer,
  viewAnswer,
  updateAnswer,
} = require("../Controller/answerController.js");

// POST /api/answers/create-answer/:id
router.post("/create-answer/:id", authMiddleWare, createAnswer);

// Get answers route
router.get("/all-answers/:id", authMiddleWare, getAnswers);

// // DELETE /api/answers/delete-answer/:id
router.delete("/delete-answer/:id", authMiddleWare, deleteAnswer);

//view answer
router.get("/view-answer/:id", authMiddleWare, viewAnswer);

//edit/update a answer 
router.put("/edit-answer/:id", authMiddleWare, updateAnswer);



module.exports = router;
