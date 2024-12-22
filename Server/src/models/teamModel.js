const db = require("../config/db");

exports.createTeam = async (name, photo, communityName) => {
  const client = await db.connect();
  try {
    const query = `
      INSERT INTO Teams (name, photo, community_name)
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const { rows } = await db.query(query, [name, photo, communityName]);
    return rows[0];
  } catch (err) {
    console.error(`Error creating team: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

// add user to team func
exports.addToTeam = async (userId, teamId) => {
  const client = await db.connect();
  try {
    const query = `
      INSERT INTO user_team (user_id, team_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, teamId]);
    return rows[0];
  } catch (err) {
    console.error(`Error adding to team: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getUserCommTeam = async (user_id, community_name) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT t.id, t.name, t.photo 
      FROM Teams AS t
      JOIN user_team AS ut ON ut.team_id = t.id 
      WHERE ut.user_id = $1 AND t.community_name = $2;
    `;
    const { rows } = await db.query(query, [user_id, community_name.community_name]);
    return rows;
  } catch (err) {
    console.error(`Error retrieving teams: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getTeamUsersCount = async (teamId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT COUNT(*)
      FROM user_team
      WHERE team_id = $1;
    `;
    const { rows } = await db.query(query, [teamId]);
    return rows[0].count;
  } catch (err) {
    console.error(`Error retrieving user_team: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};
exports.getTeamUsers = async (teamId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT u.id, u.fname, u.lname, u.points, u.photo, u.bio
      FROM Users AS u
      JOIN user_team AS ut ON u.id = ut.user_id
      WHERE ut.team_id = $1;
    `;
    const { rows } = await db.query(query, [teamId]);
    return rows;
  } catch (err) {
    console.error(`Error retreiving team members: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.deleteTeam = async (teamId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM Teams
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [teamId]);
    return rows;
  } catch (err) {
    console.error(`Error deleting team members: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};
exports.editTeam = async (teamId, name, photo) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE Teams 
      SET name = $1, photo = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await db.query(query, [name, photo, teamId]);
    return rows[0];
  } catch (err) {
    console.error(`Error editing team: ${err.message}`);
    throw new Error("Database error: Unable to edit team");
  } finally {
    client.release();
  }
};
