const dbConnection = require("../Database/DBConfig");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, firstname, lastname, email, password, confirmPassword } =
    req.body;

  // Validate input fields
  if (
    !username ||
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required!" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Check if user already exists
    const checkUserQuery =
      "SELECT username, userid FROM users WHERE email = ? OR username = ?";
    const [users] = await dbConnection.query(checkUserQuery, [email, username]);

    console.log("Database query result:", users); // Log the result to see what is returned

    if (users.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    // Insert user data into the database
    const insertUserQuery =
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)";
    const values = [username, firstname, lastname, email, hashedPassword];

    // Execute the query
    await dbConnection.query(insertUserQuery, values);

    // Respond with success message
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to register user" });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if ((!username && !email) || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Both identifier (username or email) and password are required!",
    });
  }

  try {
    let checkUserQuery, queryParams;

    // Determine if the provided input is username or email
    if (username) {
      checkUserQuery = "SELECT * FROM users WHERE username = ?";
      queryParams = [username];
    } else if (email) {
      checkUserQuery = "SELECT * FROM users WHERE email = ?";
      queryParams = [email];
    }

    // Execute the query to check if user exists
    const [users] = await dbConnection.query(checkUserQuery, queryParams);

    if (users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    } else {
      const user = users[0];
      console.log("current login user info", user);
    }

    // Further authentication logic (e.g., comparing passwords) would go here

    //Validate password
    const isPasswordValid = await bcrypt.compare(password, users[0].password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }

    // Placeholder for successful login response

    // Generate JWT
    const userName = users[0].username;
    const userID = users[0].userid;
    const userFirstName = users[0].firstname;
    const token = jwt.sign(
      { userName, userID, userFirstName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "User logged in successfully", token, userName });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to log in user" });
  }
};

const checkUser = async (req, res) => {
  try {
    const { userName, userID, userFirstName } = req.user;

    // Respond with success message
    res
      .status(StatusCodes.OK)
      .json({
        message: "User authenticated successfully",
        userName,
        userID,
        userFirstName,
      });
  } catch (error) {
    console.error("Error checking user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to check user" });
  }
};

module.exports = { register, login, checkUser };
