const { compare } = require("bcrypt");
const db = require("../config/db");

exports.createTeam = async (newTeamParams) => {
  const client = await db.connect();
  try {
    const communityCheckQuery = `
      SELECT name 
      FROM community
      WHERE name = $1;
    `;
    const communityCheckParams = [newTeamParams.communityName];
    const { rows: communityCheckRes } = await db.query(
      communityCheckQuery,
      communityCheckParams
    );
    if (!communityCheckRes.length) {
      throw new Error("Invalid community name");
    }
    const userCheckQuery = `
      SELECT u.id, j.community_name 
      FROM Users AS u, JoinAs AS j
      WHERE id = $1 AND community_name = $2;
    `;
    const userCheckParams = [newTeamParams.userId, newTeamParams.communityName];
    const { rows: userCheckRes } = await db.query(
      userCheckQuery,
      userCheckParams
    );
    console.log(userCheckRes);
    if (!userCheckRes.length) {
      throw new Error("User not found in this community");
    }
    const existingTeamQuery = `
      SELECT ut.user_id
      FROM user_team AS ut, JoinAs AS j
      WHERE ut.user_id = $1 AND j.user_id = $1 AND j.community_name = $2 ;
    `;
    const existingTeamParams = [
      newTeamParams.userId,
      newTeamParams.communityName,
    ];
    const { rows: existingTeamRes } = await db.query(
      existingTeamQuery,
      existingTeamParams
    );
    console.log(existingTeamRes);
    if (existingTeamRes.length > 0) {
      throw new Error("User is already in a team in this community");
    }
    const createTeamQuery = `
      INSERT INTO Teams (name, photo, community_name)
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const createTeamParams = [
      newTeamParams.name,
      newTeamParams.photo,
      newTeamParams.communityName,
    ];
    const { rows: createTeamRes } = await db.query(
      createTeamQuery,
      createTeamParams
    );
    const addTeamUserQuery = `
      INSERT INTO user_team(user_id, team_id)
      VALUES ($1, $2) RETURNING *;
    `;
    const teamUserParams = [newTeamParams.userId, createTeamRes[0].id];
    const { rows: teamUserRes } = await db.query(
      addTeamUserQuery,
      teamUserParams
    );
    return createTeamRes[0];
  } catch (err) {
    console.error(`Error creating team: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.inviteUserToTeam = async (invitedUserParams) => {
  const client = await db.connect();
  try{
    // validate the email and corresponding user id 
    const getUserIdQuery = `
      SELECT id 
      FROM Users
      WHERE email = $1;
    `;
    const {rows: getUserIdRes} = await db.query(getUserIdQuery, [invitedUserParams.userEmail]);
    // console.log(`email: ${invitedUserParams.userEmail}`,getUserIdRes[0]); ///////////////
    if(!getUserIdRes.length) {
      throw new Error("Invalid user email");
    }
    // check if the invited user is in the community invited to or not
    const userCheckQuery = `
      SELECT user_id, community_name
      FROM JoinAs
      WHERE user_id = $1 AND community_name = $2;
    `;
    const userCheckParams = [getUserIdRes[0].id, invitedUserParams.communityName];
    const { rows: userCheckRes } = await db.query(userCheckQuery, userCheckParams);
    // console.log('userAndCommunity',userCheckRes); ///////////////////
    if (!userCheckRes.length) {
      throw new Error(`User not found in ${invitedUserParams.communityName} community`);
    }
    // check this user is in a team in this community
    const existingTeamQuery = `
      SELECT ut.user_id, ut.team_id, t.community_name
      FROM user_team AS ut, teams AS t
      WHERE user_id = $1 AND ut.team_id = t.id AND t.community_name = $2;
    `;
    const { rows: existingTeamRes } = await db.query(
      existingTeamQuery,
      userCheckParams
    );
    console.log("existingTeamRes", existingTeamRes); //////////////////
    if (existingTeamRes.length > 0) {
      throw new Error("User is already in a team in this community");
    } 
    // check for team count 
    const userTeamCountQuery = `
      SELECT COUNT(*)
      FROM user_team
      WHERE team_id = $1;
    `;
    const { rows: userTeamCount } = await db.query(userTeamCountQuery, [invitedUserParams.teamId]);
    // console.log("teamCount", userTeamCount[0].count); /////////
    if ((userTeamCount[0].count * 1) >= 3) {
      throw new Error("Team already has maximum members.");
    }
    const inviteUserQuery = `
      INSERT INTO user_team (user_id, team_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const inviteUserParams = [getUserIdRes[0].id, invitedUserParams.teamId];
    // console.log("invitedUser",inviteUserParams); //////////////////
    const {rows: inviteUserRes} = await db.query(inviteUserQuery, inviteUserParams);
    // console.log(inviteUserRes); //////////////////
    return inviteUserRes[0];
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}
exports.getUserAllTeams = async (userCommTeams) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT team_id, name 
      FROM user_team , Teams
      WHERE user_id = $1 AND team_id = Teams.id AND community_name = $2;
    `;
    const params = [userCommTeams.userId, userCommTeams.communityName];
    const { rows: teamRows } = await db.query(query, params);
    const teams = await Promise.all(
      teamRows.map(async (team) => {
        const getTeamUserQuery = `
          SELECT user_id
          FROM user_team
          WHERE team_id = $1;
        `;
        const { rows: teamUsers } = await client.query(getTeamUserQuery, [
          team.team_id,
        ]);
        return {
          team_id: team.team_id,
          team_name: team.name,
          users: teamUsers.map((user) => user.user_id),
        };
      })
    );
    return teams;
  } catch (err) {
    console.error(`Error retrieving teams: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};
