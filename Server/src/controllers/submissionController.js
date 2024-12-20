const {submitTask, getNotApprovedSubmissions, getSubmissions, addTaskPoints, approveSubmission, getSubmitor } = require("../models/submissionModel");
const { getTeamUsers } = require("../models/teamModel");
const { getContestType, getTaskType, getMcqRightAnswer, getTaskPoints } = require("../models/contestModel");
const { getUserPoints, getUserData } = require("../models/userModel");
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
          for(let i = 0; i < team.length; ++i) {
            const userPoints = await getUserPoints(team[i].id);
            const pointsAdded = await addTaskPoints(team[i].id, userPoints + taskScore);
          }
        } else {
          const userPoints = await getUserPoints(userId);
          const pointsAdded = await addTaskPoints(userId, taskScore + userPoints);
        }
      } else {
        
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
exports.getNotApprovedSubmissions = async (req, res) => {
  const { contestId } = req.query;
  try {
    const contestType = await getContestType(+contestId);
    const submissions = await getNotApprovedSubmissions(+contestId, contestType);
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { submissions } });
  } catch (err) {
    console.log("get not approved submissions", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get not approved submissions",
        error: err.message,
      },
    });
  }
};

// GET /contest/submissions/
exports.getSubmissions = async (req, res) => {
  const { contestId } = req.query;
  try {
    const contestType = await getContestType(contestId);
    const submissions = await getSubmissions(contestId, contestType);
    if(contestType === 'team') {
      for(let i = 0; i < submissions.length; ++i) {
        const teamUsers = await getTeamUsers(submissions[i].team_id);
        submissions[i].teamUsers = teamUsers;
      }
    }
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { submissions } });
  } catch (err) {
    console.log("get submissions ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get submissions",
        error: err.message,
      },
    });
  }
};

// PATCH /contest/submissions/
exports.approveSubmission = async(req, res) => {
  const { userId, submissionId, score, contestId } = req.body;
  try {
    const approvedSub = await approveSubmission(userId, submissionId, score);
    const contestType = await getContestType(contestId);
    const approvedBy = await getUserData(userId);
    approvedSub.approved_by = approvedBy 
    const taskPoints = await getTaskPoints(approvedSub.task_id); 
    const upScore = (+score / 100) * taskPoints;
    const submitor = await getSubmitor(contestType, submissionId);
    if(contestType === 'team') {
      const team = await getTeamUsers(submitor.team_id);
      for(let i = 0; i < team.length; ++i) {
        const userPoints = await getUserPoints(team[i].id);
        const pointsAdded = await addTaskPoints(team[i].id, userPoints + upScore);
      }
    } else {
      const userPoints = await getUserPoints(submitor.individual_id);
      const pointsAdded = await addTaskPoints(submitor.individual_id, userPoints + upScore);
    }
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { approvedSub } });
  } catch (err) {
    console.log("approve submission", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "approve submission",
        error: err.message,
      },
    });
  }
};