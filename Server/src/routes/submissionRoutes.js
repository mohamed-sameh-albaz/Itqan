const express = require("express");
const router = express.Router();

const { submitTask, getWrittenSubmissions } = require("../controllers/submissionController");

router.route("/").post(submitTask).get(getWrittenSubmissions);
// router.route("/submissions/mcq")
// .get(getMcqSubmissions);
// router.route("/:contestId/tasks/written").get(getWrittenTasks);
// router.route("/:contestId/tasks/written/:taskId").patch(approveSubmission);

module.exports = router;