const express = require("express");
const { getContests, createContestWithTasks, updateContest, deleteContest, getContestsByStatus } = require("../controllers/contestController");

const router = express.Router();

router.get("/", getContests);
router.post("/", createContestWithTasks);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);
router.post("/status", getContestsByStatus); // Add this line

module.exports = router;