const teamModel = require("../models/teamModel");
const { leaveTeam }= require("../models/userModel");
// POST teams/new/:userId
exports.createTeam = async (req, res) => {
  const { userId } = req.params;
  const { name, photo, communityName } = req.body;
  try {
    const newTeamParams = { userId, name, photo, communityName };
    const newTeam = await teamModel.createTeam(newTeamParams);
    console.log(newTeam);
    res.status(201).json({
      message: "Team created successfully",
      Team: newTeam,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE teams/:userId
exports.leaveTeam = async (req, res) => {
  const { userId } = req.params;
  const { teamId } = req.body;
  try {
    const removedUserParams = { userId, teamId };
    const removedUser = await leaveTeam(removedUserParams);
    res.status(201).json({
      message: "User has successfully left the team",
      team: removedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /teams/:teamId/invite
exports.inviteUserToTeam = async (req, res) => {
  const {teamId} = req.params;
  const {userEmail, communityName} = req.body;
  try{
    const inviteUserParams = {teamId, userEmail, communityName};
    // console.log(inviteUserParams);
    const team = await teamModel.inviteUserToTeam(inviteUserParams);
    res.status(201).json({
      message: "User successfully invited to the team",
      team,
    });
  } catch(err) {
    res.status(500).json({error: err.message});
  }
}
// GET teams/:userId
exports.getAllUserTeams = async (req, res) => {
  const { userId } = req.params;
  const { communityName } = req.body;
  const userTeamsParams = { userId, communityName };
  try {
    const teams = await teamModel.getUserAllTeams(userTeamsParams);
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
