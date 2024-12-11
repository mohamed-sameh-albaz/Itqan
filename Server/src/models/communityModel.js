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
       JOIN joinAs ja ON c.name = ja.community_name
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

const promoteUser = async (promoteParams) => {
  const client = await db.connect();
  try {
    const getUserQuery = `
      SELECT id FROM Users WHERE email = $1;
    `;
    const userRes = await db.query(getUserQuery, [promoteParams.userEmail]);
    if (!userRes.rows.length) {
      throw new Error('User not found, you may enter Invalid email');
    }
    const userId = userRes.rows[0].id;
    const checkCommunityQuery = `
      SELECT * FROM JoinAs
      WHERE user_id = $1 AND community_name = $2;  
    `;
    const adminRoleQuery = `
      SELECT id FROM Roles WHERE name = 'admin';
    `;
    const { rows: adminRoleId } = await db.query(adminRoleQuery);
    const valsForUpdate = [ userId, promoteParams.communityName];
    let { rows: communityRes } = await db.query(checkCommunityQuery, valsForUpdate);
    if (!communityRes.length) {
      throw new Error("User is not part of this community");
    }
    if (communityRes[0].role_id === adminRoleId[0].id) {
      throw new Error("User is already Admin in this community");
    }
    const updateQuery = `
      UPDATE JoinAs
      SET role_id = $3 ,Approved = $4
      WHERE user_id = $1 AND community_name = $2
      RETURNING *;
    `;
    valsForUpdate.push(adminRoleId[0].id);
    valsForUpdate.push(true); // Approved
    const {rows: updateRoleRes} = await db.query(updateQuery, valsForUpdate);
    return updateRoleRes[0];
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

module.exports = { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, promoteUser };