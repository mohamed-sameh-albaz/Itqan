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
router.route("/:contestId/tasks/:taskId/submissions").post(submitTask);
router.route("/:contestId/tasks/written").get(getWrittenTasks);
router.route("/:contestId/tasks/written/:taskId").patch(approveSubmission);

module.exports = router;