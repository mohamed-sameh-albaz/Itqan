const fs = require('fs');
const path = require('path');
const pool = require("../src/config/db");

const dropDBScript = fs.readFileSync( 
  path.join(__dirname, "dropSchema.sql"),
  "utf8");

const dropDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(dropDBScript);
    console.log("Tables droped successfully!");
  } catch (err) {
    console.error("Error during table deletion:", err.message);
  } finally {
    client.release();
  }
};

dropDB();
