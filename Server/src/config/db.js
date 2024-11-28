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
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
