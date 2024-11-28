const db = require("../config/db");

const addRegisterTo = async (registerTo) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO registers_to (user_id, group_id) VALUES ($1, $2) RETURNING *`,
      [registerTo.userId, registerTo.groupId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding registerTo: ${err.message}`);
    throw new Error("Database error: Unable to add registerTo");
  } finally {
    client.release();
  }
};

module.exports = { addRegisterTo };