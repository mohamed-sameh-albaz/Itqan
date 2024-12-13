const teamModel = require("../models/teamModel");

exports.getAllUserTeams = async (req, res) => {
  const { userId } = req.params;
  const { communityName } = req.body;
  const userCommTeams = { userId, communityName };

  try {
    const teams = await teamModel.getUserAllTeams(userCommTeams);
    res.status(200).json({
      status: "success",
      data: { teams }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Validation failed",
      details: {
        field: "teams",
        error: err.message
      }
    });
  }
};
