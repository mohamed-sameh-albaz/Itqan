const {
  createTeam,
  getUserCommTeam,
  getTeamUsers,
  addToTeam,
  getTeamUsersCount,
  deleteTeam,
} = require("../models/teamModel");
const { leaveTeam, findUserByEmail } = require("../models/userModel");
const httpStatusText = require("../utils/httpStatusText");
const { getUserCommunities } = require("../models/communityModel");

// POST teams/new/
exports.createTeam = async (req, res) => {
  const { userId, name, photo, communityName } = req.body;
  try {
    const userTeam = await getUserCommTeam(userId, communityName);
    if (userTeam.length) {
      return res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message: "User is already in a team, failed to create new team",
          data: { newTeam: null },
        });
    } else {
      const newTeam = await createTeam(userId, name, photo, communityName);
      const addUserToTeam = await addToTeam(userId, newTeam.id);
      if (!newTeam) {
        return res
          .status(400)
          .json({
            status: httpStatusText.FAIL,
            message: "Faild to create new team",
            data: { newTeam: null },
          });
      }
      const users = await getTeamUsers(newTeam.id);
      return res
        .status(201)
        .json({
          status: httpStatusText.SUCCESS,
          data: { team: newTeam, team_users: users },
        });
    }
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "create team",
        error: err.message,
      },
    });
  }
};

// DELETE /teams
exports.leaveTeam = async (req, res) => {
  const { userId, teamId } = req.body;
  try {
    const user = await leaveTeam(userId, teamId);
    const users = await getTeamUsers(teamId);
    if (!users.length) {
      const team = await deleteTeam(teamId);
    }
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { team_users: users } });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "leave team",
        error: err.message,
      },
    });
  }
};

// POST /teams/invite
exports.inviteUserToTeam = async (req, res) => {
  const { userEmail, communityName, teamId } = req.body;
  try {
    const invitedUser = await findUserByEmail(userEmail);
    if (!invitedUser) {
      return res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message: "Invalid email.",
          data: { invitedUser: null },
        });
    }
    // check user is in the community update after pull

    const invitedUserTeam = await getUserCommTeam(
      invitedUser.id,
      communityName
    );
    if (!invitedUserTeam.length) {
      const teamUsersCount = await getTeamUsersCount(teamId);
      if (+teamUsersCount >= 3) {
        return res
          .status(400)
          .json({
            status: httpStatusText.FAIL,
            message: "Team is full",
            data: null,
          });
      }
      const team = await addToTeam(invitedUser.id, teamId);
      const users = await getTeamUsers(teamId);
      res
        .status(201)
        .json({ status: httpStatusText.SUCCESS, data: { team_users: users } });
    } else {
      res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message: "Invited user is already in a team",
          data: null,
        });
    }
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "invite user to team",
        error: err.message,
      },
    });
  }
};

// GET /teams?user_id&community_name
exports.getUserTeam = async (req, res) => {
  const { user_id, community_name } = req.query;
  try {
    const team = await getUserCommTeam(user_id, community_name);
    if (team.length) {
      const teamMembers = await getTeamUsers(team[0].id);
      res
        .status(200)
        .json({
          status: httpStatusText.SUCCESS,
          data: { team_users: teamMembers },
        });
    } else {
      res
        .status(200)
        .json({ status: httpStatusText.SUCCESS, data: { team_users: null } });
    }
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get user team in community",
        error: err.message,
      },
    });
  }
};
