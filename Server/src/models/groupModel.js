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

const getGroupsByCommunity = async (community_name, user_id, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: groups } = await db.query(
      `SELECT g.*, CASE WHEN rt.user_id IS NOT NULL THEN true ELSE false END as joined 
       FROM Groups g 
       LEFT OUTER JOIN registers_to rt ON rt.group_id = g.id AND rt.user_id = $2
       WHERE g.community_name = $1
       LIMIT $3 OFFSET $4`,
      [community_name, user_id, limit, offset]
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

// delete group => make sure user that deletes is admin or leader then delete all users in this group all contests related to this group remove all delete it from the community group relation
const deleteGroup = async (groupId) => {
  const client = await db.connect();
  try {
    const query = `
    DELETE FROM Groups
    WHERE id = $1
    RETURNING *;
    `;
    const { rows } = await db.query(query, [groupId]);
    return rows[0];
  } catch (err) {
    console.error(`Error in deleteGroup model: ${err.message}`);
    throw new Error("Database error while deleting group.");
  } finally {
    client.release();
  }
};

const updateGroupById = async (groupId, group) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE Groups SET description = $1, title = $2, photo = $3, community_name = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [group.description, group.title, group.photo, group.community_name, groupId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating group: ${err.message}`);
    throw new Error("Database error: Unable to update group");
  } finally {
    client.release();
  }
};

const getGroupUsersCount = async (groupId) => {
  const client = await db.connect();
  try{
    const query = `
      SELECT count(user_id) 
      FROM registers_to
      WHERE group_id = $1;
    `
    const { rows } = await db.query(query, [groupId]);
    return rows[0].count;
  } catch (err) {
    console.error(`Error updating group: ${err.message}`);
    throw new Error("Database error: Unable to update group");
  } finally {
    client.release();
  }
}

module.exports = { addGroup, getGroupsByCommunity, deleteGroup, updateGroupById, getGroupUsersCount };
