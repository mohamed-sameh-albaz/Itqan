const rewardModel = require("../models/rewardModel");
const httpStatusText = require("../utils/httpStatusText");

exports.getRewards = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    let rewards, totalCount;

    if (userId) {
      ({ rewards, totalCount } = await rewardModel.getUserRewards(userId, limit, offset));
    } else {
      ({ rewards, totalCount } = await rewardModel.getAllRewards(limit, offset));
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { rewards },
      pagination: {
        from: offset + 1,
        to: offset + rewards.length,
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
        field: "rewards",
        error: err.message,
      },
    });
  }
};

exports.createReward = async (req, res) => {
  const { description, type, name, image } = req.body;
  try {
    const newReward = await rewardModel.addReward({
      description,
      type,
      name,
      image,
    });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { reward: newReward },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "reward",
        error: err.message,
      },
    });
  }
};

exports.updateReward = async (req, res) => {
  const { rewardId } = req.params;
  const { description, type, name, image } = req.body;
  try {
    const updatedReward = await rewardModel.updateRewardById(rewardId, {
      description,
      type,
      name,
      image,
    });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { reward: updatedReward },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "reward",
        error: err.message,
      },
    });
  }
};

exports.deleteReward = async (req, res) => {
  const { rewardId } = req.params;
  try {
    await rewardModel.deleteRewardById(rewardId);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: `Reward with ID ${rewardId} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "reward",
        error: err.message,
      },
    });
  }
};