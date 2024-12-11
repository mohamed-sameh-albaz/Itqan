const submissionModel = require("../models/submissionModel");

// Post contests/:contestId/tasks/:taskId/submissions
exports.submitTask = async (req, res) => {
  const { contestId, taskId } = req.params;
  const { userId, submittedData, teamId } = req.body;
  try {
    const submission = await submissionModel.submitTask({
      contestId,
      taskId,
      userId,
      teamId,
      submittedData,
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
