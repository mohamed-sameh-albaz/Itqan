const db = require("../config/db");

exports.getAllUsers = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users");
    return rows;
  } catch (err) {
    console.error(`Error retrieving users: ${err.message}`);
    throw new Error("Database error: Unable to retrieve users");
  } finally {
    client.release();
  }
};

exports.addUser = async (user) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO users (fname, lname, email, bio, password, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.bio,
        user.password,
        user.photo,
      ]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding user: ${err.message}`);
    throw new Error("Database error: Unable to add user");
  } finally {
    client.release();
  }
};

exports.findUserByEmail = async (email) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  } catch (err) {
    console.error(`Error finding user: ${err.message}`);
    throw new Error("Database error: Unable to find user");
  } finally {
    client.release();
  }
};

exports.promoteUser = async (userId, communityName) => {
  const client = await db.connect();
  try {
    const getUsersQuery = `
    SELECT * FROM JoinAs
    WHERE user_id = $1 AND community_name = $2;  
    `;
    const adminRoleQuery = `
    SELECT id FROM Roles WHERE name = 'admin';
    `;

    let adminRoleId = await db.query(adminRoleQuery);
    adminRoleId = adminRoleId.rows[0].id;

    const valsForUpdate = [userId * 1, communityName];
    let { rows } = await db.query(getUsersQuery, valsForUpdate);
    if (!rows.length) {
      throw new Error("User not found in this community");
    }
    if (rows[0].role_id === adminRoleId) {
      throw new Error("User already has the Admin role");
    }
    const updateQuery = `
    UPDATE JoinAs
    SET role_id = $3
    WHERE user_id = $1 AND community_name = $2;
    `;
    valsForUpdate.push(adminRoleId);
    console.log(valsForUpdate);
    rows = await db.query(updateQuery, valsForUpdate);
    return {
      status: true,
      message: `User Promoted to Admin in ${communityName}`,
    };
  } catch (err) {
    console.error(`Error retrieving JoinAs: ${err.message}`);
    return {
      status: false,
      message: err.message,
    };
  } finally {
    client.release();
  }
};

exports.createTeam = async (teamParams) => {
  const client = await db.connect();
  try {
    // check for user is in this community
    const checkUserQuery = `
      SELECT u.id, j.community_name 
      FROM Users AS u, JoinAs as j
      WHERE id = $1 AND community_name = $2;
    `;
    const checkUserRes = await db.query(checkUserQuery, [
      teamParams.userId,
      teamParams.communityName,
    ]);
    if (!checkUserRes.rows.length) {
      throw new Error("User not found in this community");
    }
    console.log([teamParams.userId, teamParams.communityName], checkUserRes);
    const createTeamQuery = `
      INSERT INTO Teams (name, photo, community_name)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const newTeamParams = [
      teamParams.name,
      teamParams.photo,
      teamParams.communityName,
    ];
    const { rows } = await db.query(createTeamQuery, newTeamParams);
    const teamId = rows[0].id;
    const addTeamOwnerQuery = `
      INSERT INTO user_team(user_id, team_id)
      VALUES ($1, $2) RETURNING *;
    `;
    const teamOwnerParams = [teamParams.userId, teamId];
    const teamOwnerRes = await db.query(addTeamOwnerQuery, teamOwnerParams);
    return rows[0];
  } catch (err) {
    console.error(`Error creating team: ${err.message}`);
    throw new Error("Unable to add new team");
  } finally {
    client.release();
  }
};

exports.leaveTeam = async (userTeam) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM user_team
      WHERE user_id = $1 AND team_id = $2
      RETURNING *;
      `;
    const deleteVals = [userTeam.userId, userTeam.teamId];
    const { rows } = await db.query(query, deleteVals);
    if (!rows.length) {
      throw new Error("User is not part of this team");
    }
    const getOtherMembersQuery = `
      SELECT user_id FROM user_team
      WHERE team_id = $1;
    `;
    const {rows : otherMembers} = await db.query(getOtherMembersQuery, [userTeam.teamId]);
    console.log(userTeam.userId, otherMembers);
    return {
      leavingMember: userTeam.userId,
      otherMembers,
    };
  } catch (err) {
    console.error(`Error leaving team: ${err.message}`);
    throw new Error("Unable to leave team");
  } finally {
    client.release();
  }
};
