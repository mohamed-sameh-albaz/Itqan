const submissionModel = require("../models/submissionModel");
const httpStatusText = require("../utils/httpStatusText");

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
    return res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { submission } });
  } catch (err) {
    console.log("submit task: ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "submit tasks",
        error: err.message,
      },
    });
  }
};
