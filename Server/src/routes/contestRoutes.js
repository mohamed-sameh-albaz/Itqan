const express = require("express");
const { getContests, createContest, createTask, updateContest, deleteContest, getContestsByStatus, editContest, deleteContestById, editTaskById, deleteTaskById, getWrittenTasks, getSingleLeaderboard, getTeamLeaderboard, getTasksByContestId } = require("../controllers/contestController");
const { submitTask } = require("../controllers/submissionController");
const { approveSubmission } = require("../controllers/userController");

const router = express.Router();

router.get("/", getContests);
router.post("/", createContest);
router.post("/task", createTask);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);
router.get("/status", getContestsByStatus);
router.put("/edit/:contestId", editContest);
router.delete("/delete/:contestId", deleteContestById);
router.put("/task/edit/:taskId", editTaskById);
router.delete("/task/delete/:taskId", deleteTaskById);
router.route("/:contestId/tasks/:taskId/submissions").post(submitTask);
router.route("/:contestId/tasks/written").get(getWrittenTasks);
router.route("/:contestId/tasks/written/:taskId").patch(approveSubmission);
router.get("/:contestId/single-leaderboard", getSingleLeaderboard);
router.get("/:contestId/team-leaderboard", getTeamLeaderboard);
router.get("/:contestId/tasks", getTasksByContestId); // New route

module.exports = router;