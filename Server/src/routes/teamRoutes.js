const express = require("express");
const teamController = require("../controllers/teamController");
const router = express.Router();

router
  .route("/")
  .get(teamController.getUserTeam);
router.route("/").delete(teamController.leaveTeam);
router.route("/new").post(teamController.createTeam);
router.route("/invite").post(teamController.inviteUserToTeam);
module.exports = router;
