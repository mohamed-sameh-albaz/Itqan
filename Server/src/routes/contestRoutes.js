const express = require("express");
const { getContests, createContestWithTasks, updateContest, deleteContest, getContestsByStatus, editContest, deleteContestById, editTaskById, deleteTaskById } = require("../controllers/contestController");

const router = express.Router();

router.get("/", getContests);
router.post("/", createContestWithTasks);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);
router.get("/status", getContestsByStatus);
router.put("/edit/:contestId", editContest);
router.delete("/delete/:contestId", deleteContestById);
router.put("/task/edit/:taskId", editTaskById);
router.delete("/task/delete/:taskId", deleteTaskById);

module.exports = router;