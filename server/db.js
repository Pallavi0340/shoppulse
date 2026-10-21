
const mysql = require("mysql2/promise");
require("dotenv").config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("MySQL connected successfully!");

    const [rows] = await connection.query(
      "SELECT DATABASE() AS databaseName"
    );

    console.log(rows);
    await connection.end();
  } catch (error) {
    console.log("MySQL connection failed:", error.message);
  }
}

testConnection();
