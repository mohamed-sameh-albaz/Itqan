const db = require("../config/db");

const addJoinAs = async (joinAs) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO joinAs (user_id, role_id, community_id, approved) VALUES ($1, $2, $3, $4) RETURNING *`,
      [joinAs.userId, joinAs.roleId, joinAs.communityId, joinAs.approved]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding joinAs: ${err.message}`);
    throw new Error("Database error: Unable to add joinAs");
  } finally {
    client.release();
  }
};

module.exports = { addJoinAs };