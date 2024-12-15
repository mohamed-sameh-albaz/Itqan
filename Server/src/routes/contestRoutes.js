const express = require("express");
const { getContests, createContest, createTask, updateContest, deleteContest, getContestsByStatus, editContest, deleteContestById, editTaskById, deleteTaskById, getWrittenTasks } = require("../controllers/contestController");
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

module.exports = router;