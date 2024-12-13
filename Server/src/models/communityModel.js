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

const getAllCommunities = async (userId, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: communities } = await db.query(
      `SELECT c.*,r.id as role_id, r.name as role_name,r.color as role_color FROM ( community c left outer join joinas ja on (ja.community_name = c.name AND ja.user_id = $1) left outer join roles r on r.id = ja.role_id) LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM Community`
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { communities, totalCount };
  } catch (err) {
    console.error(`Error retrieving communities: ${err.message}`);
    throw new Error("Database error: Unable to retrieve communities");
  } finally {
    client.release();
  }
};

const getUserCommunities = async (userId, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: userCommunities } = await db.query(
      `SELECT c.*, ja.role_id, r.name as role_name
       FROM Community c
       JOIN joinAs ja ON c.name = ja.community_name
       JOIN Roles r ON ja.role_id = r.id
       WHERE ja.user_id = $1 LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM Community c
       JOIN joinAs ja ON c.name = ja.community_name
       WHERE ja.user_id = $1`,
      [userId]
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { userCommunities, totalCount };
  } catch (err) {
    console.error(`Error retrieving user communities: ${err.message}`);
    throw new Error("Database error: Unable to retrieve user communities");
  } finally {
    client.release();
  }
};

const searchCommunitiesByName = async (name, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: communities } = await db.query(
      `SELECT * FROM Community WHERE name ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${name}%`, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM Community WHERE name ILIKE $1`,
      [`%${name}%`]
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { communities, totalCount };
  } catch (err) {
    console.error(`Error searching communities: ${err.message}`);
    throw new Error("Database error: Unable to search communities");
  } finally {
    client.release();
  }
};

const getUsersByCommunityName = async (community_name, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: users } = await db.query(
      `SELECT u.id, u.email, u.fname, u.lname, u.bio, u.photo
       FROM Users u
       JOIN joinAs ja ON u.id = ja.user_id
       WHERE ja.community_name = $1 LIMIT $2 OFFSET $3`,
      [community_name, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM Users u
       JOIN joinAs ja ON u.id = ja.user_id
       WHERE ja.community_name = $1`,
      [community_name]
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { users, totalCount };
  } catch (err) {
    console.error(`Error retrieving users by community name: ${err.message}`);
    throw new Error("Database error: Unable to retrieve users by community name");
  } finally {
    client.release();
  }
};

module.exports = { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, getUsersByCommunityName };