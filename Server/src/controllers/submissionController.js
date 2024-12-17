const {submitTask, getWrittenSubmissions, addTaskPoints } = require("../models/submissionModel");
const { getTeamUsers } = require("../models/teamModel");
const { getContestType, getTaskType, getMcqRightAnswer, getTaskPoints } = require("../models/contestModel");
const { getUserPoints } = require("../models/userModel");
const httpStatusText = require("../utils/httpStatusText");

// POST /submissions/
exports.submitTask = async (req, res) => {
  const { userId, content, teamId, taskId, contestId } = req.body;
  try {
    const contestType = await getContestType(contestId);
    const taskType = await getTaskType(taskId);
    const submission = await submitTask(taskId, userId, teamId, content, contestType, taskType);
    if(taskType === 'mcq') {
      const rightAnswer = await getMcqRightAnswer(taskId);
      if(rightAnswer === content) {
        const taskScore = await getTaskPoints(taskId);
        if(contestType === 'team') {
          const team = await getTeamUsers(teamId);
          // console.log(team);
          for(let i = 0; i < team.length; ++i) {
            console.log(team[i].id);
            const userPoints = await getUserPoints(team[i].id);
            console.log(userPoints);
            const pointsAdded = await addTaskPoints(team[i].id, userPoints + taskScore);
          }
        } else {
          const userPoints = await getUserPoints(userId);
          const pointsAdded = await addTaskPoints(userId, taskScore + userPoints);
        }
      }
    }
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { submission } });
  } catch (err) {
    console.log("submit task: ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "submit written task",
        error: err.message,
      },
    });
  }
};

// GET /contest/submissions/written
exports.getWrittenSubmissions = async (req, res) => {
  const { contestId } = req.query;
  try {
    const contestType = await getContestType(contestId);
    const submissions = await getWrittenSubmissions(contestId, contestType);
    return res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { submissions } });
  } catch (err) {
    console.log("submit task: ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get written submissions",
        error: err.message,
      },
    });
  }
};

