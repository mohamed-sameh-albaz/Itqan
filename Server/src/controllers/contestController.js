const { getAllContests, addContest, getContestsByStatus, updateContestById, deleteContestById, getSingleLeaderboard, getTeamLeaderboard, getTasksByContestId, getWrittenSubmissions, getContestType } = require("../models/contestModel");
const { addTask, addMcqTask, updateTaskById, deleteTaskById } = require("../models/taskModel");
const { submitTask } = require("../models/userModel")
const httpStatusText = require("../utils/httpStatusText");

exports.getContests = async (req, res) => {
  try {
    const contests = await getAllContests();
    res.status(200).json({
      status: "success",
      data: { contests },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contests",
        error: err.message,
      },
    });
  }
};

exports.createContest = async (req, res) => {
  const { description, type, difficulty, name, start_date, end_date, status, group_id } = req.body;
  try {
    const newContest = await addContest({
      description,
      type,
      difficulty,
      name,
      start_date,
      end_date,
      status,
      group_id
    });

    res.status(201).json({
      status: "success",
      data: { contest: newContest },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message,
      },
    });
  }
};

exports.createTask = async (req, res) => {
  const { description, title, points, type, image, mcqData, contest_id } = req.body;

  try {
    const newTask = await addTask({
      description,
      title,
      points,
      type,
      image,
      contest_id
    });

    if (type === "mcq" && mcqData) {
      await addMcqTask({ ...mcqData, id: newTask.id });
    }

    res.status(201).json({
      status: "success",
      data: { task: newTask },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "task",
        error: err.message,
      },
    });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const contest = await updateContestById(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: { contest },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message,
      },
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
        error: err.message,
      },
    });
  }
};

exports.getContestsByStatus = async (req, res) => {
  const { community_name, group_id, status, limit } = req.query;

  try {
    const contests = await getContestsByStatus({
      community_name,
      group_id,
      status,
      limit,
    });
    res.status(200).json({
      status: "success",
      data: { contests: contests.length ? contests : [] },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contests",
        error: err.message,
      },
    });
  }
};

exports.editContest = async (req, res) => {
  const { contestId } = req.params;
  const { description, type, difficulty, name, start_date, end_date, status } =
    req.body;

  try {
    const updatedContest = await updateContestById(contestId, {
      description,
      type,
      difficulty,
      name,
      start_date,
      end_date,
      status,
    });

    res.status(200).json({
      status: "success",
      data: { contest: updatedContest },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message,
      },
    });
  }
};

exports.deleteContestById = async (req, res) => {
  const { contestId } = req.params;

  try {
    await deleteContestById(contestId);
    res.status(200).json({
      status: "Success",
      message: "Successfully Deleted Contest with ID: " + contestId,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "contest",
        error: err.message,
      },
    });
  }
};

exports.editTaskById = async (req, res) => {
  const { taskId } = req.params;
  const { description, title, points, type, image, mcqData } = req.body;

  try {
    const updatedTask = await updateTaskById(taskId, {
      description,
      title,
      points,
      type,
      image,
      mcqData,
    });

    res.status(200).json({
      status: "success",
      data: { task: updatedTask },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "task",
        error: err.message,
      },
    });
  }
};

exports.deleteTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    await deleteTaskById(taskId);
    res.status(200).json({
      status: "success",
      message: `Task with ID ${taskId} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "task",
        error: err.message,
      },
    });
  }
};

exports.getSingleLeaderboard = async (req, res) => {
  const { contestId } = req.params;
  try {
    const leaderboard = await getSingleLeaderboard(contestId);
    res.status(200).json({
      status: "success",
      data: { leaderboard },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "leaderboard",
        error: err.message,
      },
    });
  }
};
exports.getTeamLeaderboard = async (req, res) => {
  const { contestId } = req.params;
  try {
    const leaderboard = await getTeamLeaderboard(contestId);
    res.status(200).json({
      status: "success",
      data: { leaderboard },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "leaderboard",
        error: err.message,
      },
    });
  }
};

exports.getTasksByContestId = async (req, res) => {
  const { contestId } = req.params;
  const { editing } = req.query;
  try {
    const tasks = await getTasksByContestId(contestId, editing);
    res.status(200).json({
      status: "success",
      data: { tasks },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "tasks",
        error: err.message,
      },
    });
  }
};
