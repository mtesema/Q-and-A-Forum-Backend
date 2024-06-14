const express = require("express");
const router = express.Router();

// Authentication middleware
const authMiddleWare = require("../MiddleWare/authMiddleWare");
const { createAnswer } = require("../Controller/answerController.js");

// POST /api/answers/create-answer/:id
router.post("/create-answer/:id", authMiddleWare, createAnswer);

// // Get answers route
// router.get("/all-answers", authMiddleWare, getAnswers);

// // Get answer route
// router.get("/answer-detail/:id", authMiddleWare, getAnswer);

module.exports = router;
