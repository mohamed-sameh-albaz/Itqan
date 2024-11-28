const db = require("../config/db");

const getAllUsers = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users");
    return rows;
  } catch (err) {
    console.error(`Error retrieving users: ${err.message}`);
    throw new Error("Database error: Unable to retrieve users");
  } finally {
    client.release();
  }
};

const addUser = async (user) => {
  const client = await db.connect();
  try {
    const { row } = await db.query(
      `INSERT INTO users (firstname, lastname, email, bio, password) VALUES ($1, $2, $3, $4, $5)`,
      [user.firstname, user.lastname, user.email, user.bio, user.password]
    );
    return row;
  } catch (err) {
    console.error(`Error adding user: ${err.message}`);
    throw new Error("Database error: Unable to add user");
  } finally {
    client.release();
  }
};

module.exports = { getAllUsers, addUser };
