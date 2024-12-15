const levelModel = require("../models/levelModel");
const httpStatusText = require("../utils/httpStatusText");

exports.getLevels = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { levels, totalCount } = await levelModel.getAllLevels(limit, offset);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { levels },
      pagination: {
        from: offset + 1,
        to: offset + levels.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "levels",
        error: err.message,
      },
    });
  }
};

exports.createLevel = async (req, res) => {
  const { name, pointsThreshold, reward_id } = req.body;
  try {
    const newLevel = await levelModel.addLevel({
      name,
      pointsThreshold,
      reward_id,
    });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { level: newLevel },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "level",
        error: err.message,
      },
    });
  }
};

exports.updateLevel = async (req, res) => {
  const { levelId } = req.params;
  const { name, pointsThreshold, reward_id } = req.body;
  try {
    const updatedLevel = await levelModel.updateLevelById(levelId, {
      name,
      pointsThreshold,
      reward_id,
    });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { level: updatedLevel },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "level",
        error: err.message,
      },
    });
  }
};

exports.deleteLevel = async (req, res) => {
  const { levelId } = req.params;
  try {
    await levelModel.deleteLevelById(levelId);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: `Level with ID ${levelId} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "level",
        error: err.message,
      },
    });
  }
};