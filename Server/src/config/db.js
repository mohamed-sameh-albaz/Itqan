const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "../.env" });

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;
console.log(process.env); // testing
console.log({ PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT }); // testing

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false,
    mode: "require",
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
