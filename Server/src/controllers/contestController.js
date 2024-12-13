const { getAllContests, addContest, getContestsByStatus, updateContestById, deleteContestById } = require("../models/contestModel");
const { addTask, addMcqTask } = require("../models/taskModel");

exports.getContests = async (req, res) => {
  try {
    const contests = await getAllContests();
    res.status(200).json({
      status: "success",
      data: { contests }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contests",
        error: err.message
      }
    });
  }
};

exports.createContestWithTasks = async (req, res) => {
  const { contest, tasks } = req.body;

  try {
    const newContest = await addContest(contest);
    const contestId = newContest.id;

    const taskPromises = tasks.map(async task => {
      const newTask = await addTask({ ...task, contest_id: contestId });
      if (task.type === 'mcq') {
        await addMcqTask({ ...task.mcqData, id: newTask.id });
      }
    });

    await Promise.all(taskPromises);

    res.status(201).json({
      status: "success",
      data: { contest: newContest, tasks }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message
      }
    });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const contest = await updateContestById(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: { contest }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message
      }
    });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    await deleteContestById(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message
      }
    });
  }
};

exports.getContestsByStatus = async (req, res) => {
  const { community_name, group_id, status, limit } = req.query;

  try {
    const contests = await getContestsByStatus({ community_name, group_id, status, limit });
    res.status(200).json({
      status: "success",
      data: { contests: contests.length ? contests : [] }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contests",
        error: err.message
      }
    });
  }
};