const express = require("express");
const teamController = require("../controllers/teamController");
const router = express.Router();

router.get("/:userId", teamController.getAllUserTeams);
router.post("/new/:userId", teamController.createTeam);
router.delete("/:userId", teamController.leaveTeam);
router.post("/:teamId/invite", teamController.inviteUserToTeam);
module.exports = router;
