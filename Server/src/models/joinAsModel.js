const db = require("../config/db");

const addJoinAs = async (joinAs) => {
  const client = await db.connect();
  try {
    // Check if the community exists
    const { rows: existingCommunity } = await db.query(
      `SELECT * FROM Community WHERE name = $1`,
      [joinAs.communityName]
    );

    if (existingCommunity.length === 0) {
      throw new Error("Community does not exist");
    }

    // Check if the user is already joined to the community
    const { rows: existingJoinAs } = await db.query(
      `SELECT * FROM joinAs WHERE user_id = $1 AND community_name = $2`,
      [joinAs.userId, joinAs.communityName]
    );

    if (existingJoinAs.length > 0) {
      throw new Error("User is already joined to the community");
    }

    const { rows } = await db.query(
      `INSERT INTO joinAs (user_id, role_id, community_name, approved) VALUES ($1, $2, $3, $4) RETURNING *`,
      [joinAs.userId, joinAs.roleId, joinAs.communityName, joinAs.approved]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding joinAs: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

const removeJoinAs = async (userId, communityName) => {
  const client = await db.connect();
  try {
    const { rows: roleRows } = await db.query(
      `SELECT role_id FROM joinAs WHERE user_id = $1 AND community_name = $2`,
      [userId, communityName]
    );

    if (roleRows.length === 0) {
      return { message: "User not found in the community" };
    }

    const roleId = roleRows[0].role_id;
    if (+roleId === 1) {
      return { message: "An admin cannot leave the community" };
    }

    const { rows } = await db.query(
      `DELETE FROM joinAs WHERE user_id = $1 AND community_name = $2 RETURNING *`,
      [userId, communityName]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error removing joinAs: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

module.exports = { addJoinAs, removeJoinAs };