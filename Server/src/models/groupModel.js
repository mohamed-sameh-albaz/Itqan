const db = require("../config/db");

const addGroup = async (group) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Groups (description, title, photo, comm_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [group.description, group.title, group.photo, group.comm_id]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding group: ${err.message}`);
    throw new Error("Database error: Unable to add group");
  } finally {
    client.release();
  }
};

const getGroupsByCommunity = async (comm_id) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `SELECT * FROM Groups WHERE comm_id = $1`,
      [comm_id]
    );
    return rows;
  } catch (err) {
    console.error(`Error retrieving groups: ${err.message}`);
    throw new Error("Database error: Unable to retrieve groups");
  } finally {
    client.release();
  }
};

module.exports = { addGroup, getGroupsByCommunity };