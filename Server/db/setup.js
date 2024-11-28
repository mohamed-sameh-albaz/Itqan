const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

const createTableScript = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);
console.log(createTableScript); // testing

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(createTableScript);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error during table creation:", err);
  } finally {
    client.release();
  }
};

setupDatabase();
