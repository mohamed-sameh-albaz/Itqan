const db = require("../config/db");

const addGroup = async (group) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Groups (description, title, photo, community_name) VALUES ($1, $2, $3, $4) RETURNING *`,
      [group.description, group.title, group.photo, group.community_name]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding group: ${err.message}`);
    throw new Error("Database error: Unable to add group");
  } finally {
    client.release();
  }
};

const getGroupsByCommunity = async (community_name, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: groups } = await db.query(
      `SELECT * FROM Groups WHERE community_name = $1 LIMIT $2 OFFSET $3`,
      [community_name, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM Groups WHERE community_name = $1`,
      [community_name]
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { groups, totalCount };
  } catch (err) {
    console.error(`Error retrieving groups: ${err.message}`);
    throw new Error("Database error: Unable to retrieve groups");
  } finally {
    client.release();
  }
};

module.exports = { addGroup, getGroupsByCommunity };