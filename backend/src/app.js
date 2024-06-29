require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3306; // Use a configurable port

// Enable CORS middleware
app.use(cors());

// JSON middleware to parse JSON request bodies
app.use(express.json());

// DB connection
const dbConnection = require("./Database/DBConfig");

// User routes middleware
const userRoutes = require("./Routes/userRoutes");
app.use("/api/users", userRoutes);

// Questions routes middleware
const questionsRoutes = require("./Routes/questionsRoute");
app.use("/api/questions", questionsRoutes);

// Answers routes middleware
const answersRoutes = require("./Routes/answersRoute");
app.use("/api/answers", answersRoutes);

const start = async () => {
  try {
    // Check the connection
    const connection = await dbConnection.getConnection();
    
    console.log("Successfully connected to MySQL on app.js");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error("Error connecting to MySQL @ app.js:", error.message);
  }
};

// Start the application
start();