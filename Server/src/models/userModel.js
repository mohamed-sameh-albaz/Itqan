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
    const { rows } = await db.query(
      `INSERT INTO users (fname, lname, email, bio, password, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user.firstname, user.lastname, user.email, user.bio, user.password, user.photo]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding user: ${err.message}`);
    throw new Error("Database error: Unable to add user");
  } finally {
    client.release();
  }
};

const findUserByEmail = async (email) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
  } catch (err) {
    console.error(`Error finding user: ${err.message}`);
    throw new Error("Database error: Unable to find user");
  } finally {
    client.release();
  }
};

module.exports = { getAllUsers, addUser, findUserByEmail };
