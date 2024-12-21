const db = require("../config/db");

const addCommunity = async (community) => {
  const client = await db.connect();
  try {
    // Check if the community name already exists
    const { rows: existingCommunity } = await db.query(
      `SELECT * FROM Community WHERE name = $1`,
      [community.name]
    );

    if (existingCommunity.length > 0) {
      throw new Error("Community name already exists");
    }

    const { rows } = await db.query(
      `INSERT INTO Community (name, color, description) VALUES ($1, $2, $3) RETURNING *`,
      [community.name, community.color, community.description]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding community: ${err.message}`);
    throw new Error(err.message);
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
      `SELECT c.*, ja.role_id, r.name as role_name, r.color as role_color
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
      `SELECT u.id, u.email, u.fname, u.lname, u.bio, u.photo, r.id AS role_id, r.color AS role_color
      FROM Users u
      JOIN joinAs ja ON u.id = ja.user_id
      JOIN Roles r ON ja.role_id = r.id
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

const promoteUser = async (userId, communityName,  roleId) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE JoinAs
      SET role_id = $3, Approved = true
      WHERE user_id = $1 AND community_name = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, communityName, roleId]);
    return rows[0];
  } catch (err) {
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

const updateCommunityById = async (communityId, community) => {
  const client = await db.connect();
  try {
    // Check if the community name already exists
    const { rows: existingCommunity } = await db.query(
      `SELECT * FROM Community WHERE name = $1 AND id <> $2`,
      [community.name, communityId]
    );

    if (existingCommunity.length > 0) {
      throw new Error("Community name already exists");
    }

    const { rows } = await db.query(
      `UPDATE Community SET name = $1, color = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [community.name, community.color, community.description, communityId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating community: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

const removeCommunityById = async (communityId) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM Community WHERE id = $1", [communityId]);
  } catch (err) {
    console.error(`Error deleting community: ${err.message}`);
    throw new Error("Database error: Unable to delete community");
  } finally {
    client.release();
  }
};

module.exports = { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, getUsersByCommunityName, promoteUser, updateCommunityById, removeCommunityById };
