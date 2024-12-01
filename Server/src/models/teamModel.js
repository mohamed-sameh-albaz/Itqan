const { compare } = require("bcrypt");
const db = require("../config/db");

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
        const { rows: teamUsers } = await client.query(getTeamUserQuery, [team.team_id]);
        return {
          team_id: team.team_id,
          team_name: team.name,
          users: teamUsers.map(user => user.user_id),
        };
      })
    );
    return teams;
  } catch (err) {
    console.error(`Error retrieving teams: ${err.message}`);
    throw new Error("Unable to retrieve teams");
  } finally {
    client.release();
  }
};
