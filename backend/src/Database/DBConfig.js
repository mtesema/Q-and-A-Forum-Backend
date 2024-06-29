const mysql = require("mysql2");

// Create a pool of connections to the database
const dbConnection = mysql.createPool({
  user: process.env.ADMIN_USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  connectionLimit: 10,
  host: process.env.HOST,
});

// Log environment variables (do not log passwords in production)
console.log("DB Config - User:", process.env.ADMIN_USER);
console.log("DB Config - Database:", process.env.DATABASE);
console.log("DB Config - Host:", process.env.HOST);
console.log("DB Config - Password:", process.env.PASSWORD);
console.log("DB Config - Port:", process.env.PORT);

// Get a connection from the pool
dbConnection.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to MySQL @ DBConfig:", error.message);
    return;
  }
  console.log("Successfully connected to MySQL");

  // Accessing properties within the connection callback
  console.log("Database:", connection.config.database);
  console.log("Host:", connection.config.host);

  // Release the connection back to the pool
  connection.release();
});
module.exports = dbConnection.promise();
