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

const removeRegisterTo = async (userId, groupId) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `DELETE FROM registers_to WHERE user_id = $1 AND group_id = $2 RETURNING *`,
      [userId, groupId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error removing registerTo: ${err.message}`);
    throw new Error("Database error: Unable to remove registerTo");
  } finally {
    client.release();
  }
};

module.exports = { addRegisterTo, removeRegisterTo };