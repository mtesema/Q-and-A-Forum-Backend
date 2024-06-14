const express = require("express");
const router = express.Router();

//Authentication middleware
const authMiddleWare = require("../MiddleWare/authMiddleWare");

const {
    createQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../Controller/questionController");

//create question route
router.post("/ask-questions", authMiddleWare, createQuestion);

//get questions route
router.get("/all-questions", authMiddleWare, getQuestions);

//get question route
router.get('/question-detail/:id',authMiddleWare, getQuestion);

// //update question route
// router.put("/all-questions/:id", authMiddleWare, updateQuestion);

// //delete question route
// router.delete("/all-questions/:id", authMiddleWare, deleteQuestion);

module.exports = router;

