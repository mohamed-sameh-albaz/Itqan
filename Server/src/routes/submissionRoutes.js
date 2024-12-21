const express = require("express");
const router = express.Router();

const { submitTask, getPendingSubmissions, getSubmissions, approveSubmission } = require("../controllers/submissionController");

router.route("/").post(submitTask).get(getSubmissions);
router.route("/written").get(getPendingSubmissions).patch(approveSubmission);

module.exports = router;