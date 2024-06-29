const express = require("express");
const router = express.Router();

//Authentication middleware
const authMiddleWare = require("../MiddleWare/authMiddleWare");
const {
  createQuestion,
  getQuestions,
  getQuestion,
  getuesrQuestions,
  putIncrement,
  updateQuestion,
  deleteQuestion
} = require("../Controller/questionController");

//create question route
router.post("/ask-questions", authMiddleWare, createQuestion);

//get questions route
router.get("/all-questions", authMiddleWare, getQuestions);

//filter all questions per user to display on user profile 
router.get("/user-questions", authMiddleWare, getuesrQuestions);

//Counte how many clicks 
router.put("/increment/:id", authMiddleWare, putIncrement);

//get question route
router.get('/question-detail/:id', authMiddleWare, getQuestion);

//delete question route
router.delete("/:id", authMiddleWare, deleteQuestion);

// //update question route
// router.put("/all-questions/:id", authMiddleWare, updateQuestion);

module.exports = router;