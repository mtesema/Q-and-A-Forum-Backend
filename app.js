require("dotenv").config();
// console.log("Loaded ENV variables:", process.env);

const cors = require("cors");
const express = require("express");
const app = express();
const port = 5500;

// Enable CORS middleware
app.use(cors());

//json middleware to extract json
app.use(express.json());

//db connection
const dbConnection = require("./Database/DBConfig");

//user routes middleware fire
const userRoutes = require("./Routes/userRoutes");
app.use("/api/users", userRoutes);

//qustions routes middleware file??

//answers routes middleware fire??

const start = async () => {
  try {
    // Check the connection
    const connection = await dbConnection.getConnection();
    console.log("Successfully connected to MySQL on app.js");

    // Execute a test query
    // const [results] = await connection.query("SELECT 'test' AS result");
    // console.log("Query results:", results);

    // Start the server
    app.listen(port);
    console.log(`Server running on port ${port}`);

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error("Error connecting to MySQL @ app.js:", error.message);
  }
};

// Start the application
start();

