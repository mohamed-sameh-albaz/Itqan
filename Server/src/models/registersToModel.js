const db = require("../config/db");

const addRegisterTo = async (registerTo) => {
  const client = await db.connect();
  try {
    // Validate userId and groupId
    if (!registerTo.userId || !registerTo.groupId) {
      throw new Error("User ID and Group ID cannot be empty or null");
    }

    // Check if the user exists
    const { rows: existingUser } = await db.query(
      `SELECT * FROM Users WHERE id = $1`,
      [registerTo.userId]
    );

    if (existingUser.length === 0) {
      throw new Error("User does not exist");
    }

    // Check if the group exists
    const { rows: existingGroup } = await db.query(
      `SELECT * FROM Groups WHERE id = $1`,
      [registerTo.groupId]
    );

    if (existingGroup.length === 0) {
      throw new Error("Group does not exist");
    }

    // Check if the user is already in the group
    const { rows: userInGroup } = await db.query(
      `SELECT * FROM registers_to WHERE user_id = $1 AND group_id = $2`,
      [registerTo.userId, registerTo.groupId]
    );

    if (userInGroup.length > 0) {
      throw new Error("User is already in the group");
    }

    const { rows } = await db.query(
      `INSERT INTO registers_to (user_id, group_id) VALUES ($1, $2) RETURNING *`,
      [registerTo.userId, registerTo.groupId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding registerTo: ${err.message}`);
    throw new Error(err.message);
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