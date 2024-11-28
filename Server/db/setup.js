const db = require("../src/config/db");

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        bio TEXT,
        password VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `);
    console.log("Tables created successfully");
  } catch (err) {
    console.log(`Falid to create the tables, ${err}`);
  } finally {
    process.exit;
  }
};

createTables();
