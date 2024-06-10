const express = require('express')
const router = express.Router()

//Authentication middleware
const authMiddleWare = require("../MiddleWare/authMiddleWare");

const { register, login, checkUser } = require("../Controller/userController");


//registration route
router.post("/register", register);

//Login route
router.post("/login", login);


//check user 
router.get("/check", authMiddleWare, checkUser);





module.exports = router