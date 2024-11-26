const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

// Create a new pool instance with SSL configuration
const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(express.json());

app.get("/create-users-table", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        bio TEXT,
        password VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    res.send("Users table created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating users table");
  }
});

app.post("/add-users", async (req, res) => {
  const users = [
    { firstname: "John", lastname: "Doe", email: "john.doe@example.com", bio: "Bio of John", password: "password123" },
    { firstname: "Jane", lastname: "Doe", email: "jane.doe@example.com", bio: "Bio of Jane", password: "password123" },
    { firstname: "Alice", lastname: "Smith", email: "alice.smith@example.com", bio: "Bio of Alice", password: "password123" },
    { firstname: "Bob", lastname: "Brown", email: "bob.brown@example.com", bio: "Bio of Bob", password: "password123" },
    { firstname: "Charlie", lastname: "Davis", email: "charlie.davis@example.com", bio: "Bio of Charlie", password: "password123" }
  ];

  try {
    const client = await pool.connect();
    for (const user of users) {
      await client.query(
        `INSERT INTO users (firstname, lastname, email, bio, password) VALUES ($1, $2, $3, $4, $5)`,
        [user.firstname, user.lastname, user.email, user.bio, user.password]
      );
    }
    client.release();
    res.send("5 users added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding users");
  }
});

app.get("/get-users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM users`);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Test database connection
app.get("/test-db-connection", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    res.send("Database connection successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});