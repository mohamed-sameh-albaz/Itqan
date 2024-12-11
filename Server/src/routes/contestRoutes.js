const express = require("express");
const { getContests, createContestWithTasks, updateContest, deleteContest, getContestsByStatus, getWrittenTasks } = require("../controllers/contestController");
const { submitTask } = require("../controllers/submissionController");
const { approveSubmission } = require("../controllers/userController");

const router = express.Router();

router.get("/", getContests);
router.post("/", createContestWithTasks);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);
router.post("/status", getContestsByStatus); // Add this line
router.post("/:contestId/tasks/:taskId/submissions", submitTask);
router.get("/:contestId/tasks/written", getWrittenTasks);
router.patch("/:contestId/tasks/written/:taskId", approveSubmission);

module.exports = router;