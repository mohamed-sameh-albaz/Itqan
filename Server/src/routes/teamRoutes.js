const express = require("express");
const userController = require("../controllers/userController");
const teamController = require('../controllers/teamController');
const router = express.Router();

router.get("/:userId", teamController.getAllUserTeams);
router.post("/new/:userId", userController.createTeam);
router.delete("/:userId", userController.leaveTeam);

module.exports = router;
