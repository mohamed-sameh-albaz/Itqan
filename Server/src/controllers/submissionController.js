const {submitTask, getPendingSubmissions, getSubmissions, addTaskPoints, approveSubmission, getSubmitor, setSubmissionScore, checkSubmitorSubs, checkApproved} = require("../models/submissionModel");
const { getTeamUsers, getUserCommTeam } = require("../models/teamModel");
const { getContestType, getTaskType, getMcqRightAnswer, getTaskPoints, setContestStatus, getContestCommunity } = require("../models/contestModel");
const { getUserPoints, getUserData } = require("../models/userModel");
const httpStatusText = require("../utils/httpStatusText");

// POST /submissions/
exports.submitTask = async (req, res) => {
  const { userId, content, taskId, contestId } = req.body;
  try {
    const contestType = await getContestType(contestId);
    let checkSubmitorSubmissions, userTeam;
    if(contestType === 'team') {
      const contestCommunity = await getContestCommunity(contestId);
      userTeam = await getUserCommTeam(userId, contestCommunity);
      checkSubmitorSubmissions = await checkSubmitorSubs({userId, teamId: userTeam[0].id, taskId});
    } else {
      checkSubmitorSubmissions = await checkSubmitorSubs({ userId, teamId: null, taskId });
    }
    if(checkSubmitorSubmissions.length) {
      return res.status(400).json({
        status: httpStatusText.ERROR,
        message: "only one submission is allowed",
        details: {
          field: "submit task",
        },
      });
    }
    const taskType = await getTaskType(taskId);
    let submission;
    if(contestType === 'team') {
      submission = await submitTask(taskId, userId, userTeam[0].id, content, contestType, taskType);
    } else {
      submission = await submitTask(taskId, userId, null, content, contestType, taskType);
    }
    if(taskType === 'mcq') {
      const rightAnswer = await getMcqRightAnswer(taskId);
      if(rightAnswer === content) {
        const taskScore = await getTaskPoints(taskId);
        const submissionScore = await setSubmissionScore(submission.id, taskScore, 'Accepted');
        submission.score = submissionScore.score;
        submission.status = submissionScore.status;
        if(contestType === 'team') {
          const team = await getTeamUsers(userTeam.id);
          for(let i = 0; i < userTeam.length; ++i) {
            const userPoints = await getUserPoints(team[i].id);
            const pointsAdded = await addTaskPoints(team[i].id, userPoints + taskScore);
          }
        } else {
          const userPoints = await getUserPoints(userId);
          const pointsAdded = await addTaskPoints(userId, taskScore + userPoints);
        }
      } else {
        const submissionScore = await setSubmissionScore(submission.id, 0, 'Rejected');
        submission.score = submissionScore.score;
        submission.status = submissionScore.status;
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
        field: "submit task",
        error: err.message,
      },
    });
  }
};

// GET /contest/submissions/written
exports.getPendingSubmissions = async (req, res) => {
  const { contestId } = req.query;
  try {
    const contestType = await getContestType(+contestId);
    const submissions = await getPendingSubmissions(+contestId, contestType);
    console.log(submissions);
    if(!submissions.length) {
      const finishContest = await setContestStatus(contestId);
    }
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { submissions } });
  } catch (err) {
    console.log("get pending submissions", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get pending submissions",
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
    const approvedCheck = await checkApproved(submissionId);
    if(approvedCheck.length) {
      return res.status(400).json({
        status: httpStatusText.ERROR,
        message: "this submission is already approved",
        details: {
          field: "approve submission",
        },
      });
    }
    const approvedSub = await approveSubmission(userId, submissionId, score);
    const contestType = await getContestType(contestId);
    const approvedBy = await getUserData(userId);
    approvedSub.approved_by = approvedBy 
    const taskPoints = await getTaskPoints(approvedSub.task_id); 
    const upScore = (+score / 100) * taskPoints;
    if(upScore) {
      const submissionScore = await setSubmissionScore(submissionId, upScore, 'Accepted');
      approvedSub.score = submissionScore.score;
      approvedSub.status = submissionScore.status;
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
    } else {
      const submissionScore = await setSubmissionScore(submissionId, 0, 'Rejected');
      approvedSub.score = submissionScore.score;
      approvedSub.status = submissionScore.status;
    }
    const submissions = await getPendingSubmissions(+contestId, contestType);
    if(!submissions.length) {
      const finishContest = await setContestStatus(contestId);
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