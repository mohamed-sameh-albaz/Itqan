const express = require("express");
const teamController = require("../controllers/teamController");
const router = express.Router();

router
  .route("/")
  .get(teamController.getUserTeam)
  .put(teamController.editTeam)
  .delete(teamController.leaveTeam);
router.route("/new").post(teamController.createTeam);
router.route("/invite").post(teamController.inviteUserToTeam);
router.route("/:teamId").delete(teamController.deleteTeam);
module.exports = router;
