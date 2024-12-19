const express = require("express");
const router = express.Router();

const { submitTask, getNotApprovedSubmissions, getSubmissions, approveSubmission } = require("../controllers/submissionController");

router.route("/").post(submitTask).get(getSubmissions);
router.route("/written").get(getNotApprovedSubmissions).patch(approveSubmission);

module.exports = router;