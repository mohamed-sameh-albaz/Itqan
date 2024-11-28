const db = require("../config/db");

const addCommunity = async (community) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Community (name, color, description) VALUES ($1, $2, $3) RETURNING *`,
      [community.name, community.color, community.description]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding community: ${err.message}`);
    throw new Error("Database error: Unable to add community");
  } finally {
    client.release();
  }
};

const getAllCommunities = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM Community");
    return rows;
  } catch (err) {
    console.error(`Error retrieving communities: ${err.message}`);
    throw new Error("Database error: Unable to retrieve communities");
  } finally {
    client.release();
  }
};

const getUserCommunities = async (userId) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `SELECT c.*, ja.role_id, r.name as role_name
       FROM Community c
       JOIN joinAs ja ON c.id = ja.community_id
       JOIN Roles r ON ja.role_id = r.id
       WHERE ja.user_id = $1`,
      [userId]
    );
    return rows;
  } catch (err) {
    console.error(`Error retrieving user communities: ${err.message}`);
    throw new Error("Database error: Unable to retrieve user communities");
  } finally {
    client.release();
  }
};

const searchCommunitiesByName = async (name) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `SELECT * FROM Community WHERE name ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  } catch (err) {
    console.error(`Error searching communities: ${err.message}`);
    throw new Error("Database error: Unable to search communities");
  } finally {
    client.release();
  }
};

module.exports = { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName };