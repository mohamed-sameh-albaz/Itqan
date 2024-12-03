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

const getGroupsByCommunity = async (community_name) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `SELECT * FROM Groups WHERE community_name = $1`,
      [community_name]
    );
    return rows;
  } catch (err) {
    console.error(`Error retrieving groups: ${err.message}`);
    throw new Error("Database error: Unable to retrieve groups");
  } finally {
    client.release();
  }
};

// delete group => make sure user that deletes is admin or leader then delete all users in this group all contests related to this group remove all delete it from the community group relation
const deleteGroup = async (deletedGroupParams) => {
  const client = await db.connect();
  try {
    // check this group in the specific community
    const groupExistsQuery = `
    SELECT community_name 
    FROM groups
    WHERE id = $1;
    `;
    const { rows: groupExists } = await db.query(groupExistsQuery, [
      deletedGroupParams.groupId,
    ]);
    // console.log(groupExists); ///////////////////
    if (!groupExists.length) {
      return { error: "Group not found " };
    }
    const communityName = groupExists[0].community_name;
    // check that who can delete this group is admin or leader
    const roleCheckQuery = `
    SELECT name
    FROM roles AS r, JoinAs AS j
    WHERE j.user_id = $1 AND j.community_name = $2 AND j.role_id = r.id
    `;
    const { rows: roleCheck } = await db.query(roleCheckQuery, [
    deletedGroupParams.userId,
    communityName,
    ]);
    // console.log(roleCheck[0].name);/////////////////
    if (!roleCheck.length || !["admin", "leader"].includes(roleCheck[0].name)) {
      throw new Error(
        "Permission denied. Only admins or leaders can delete the group."
      );
    }
    // console.log(3);///////////
    // delete all users regin this group 
    const deleteInUsersQuery = `
    DELETE FROM registers_to
    WHERE group_id = $1
    RETURNING *;
    `;
    const { rows: deleteInUsers } = await db.query(deleteInUsersQuery, [
      deletedGroupParams.groupId,
    ]);
    // console.log(deleteInUsers);////////////
    const deleteGroupQuery = `
    DELETE FROM Groups
    WHERE id = $1
    RETURNING *;
    `;
    const { rows: deletedGroup } = await db.query(deleteGroupQuery, [
      deletedGroupParams.groupId,
    ]);
    return { data: deletedGroup[0] };
  } catch (err) {
    console.error(`Error in deleteGroup model: ${err.message}`);
    throw new Error("Database error while deleting group.");
  } finally {
    client.release();
  }
};
module.exports = { addGroup, getGroupsByCommunity, deleteGroup };
