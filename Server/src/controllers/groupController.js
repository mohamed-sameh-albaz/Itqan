const { addGroup, deleteGroup, updateGroupById } = require("../models/groupModel");
const { addRegisterTo, removeRegisterTo } = require("../models/registersToModel");
const httpStatusText = require("../utils/httpStatusText");

exports.createGroup = async (req, res) => {
  const { description, title, photo, community_name } = req.body;

  try {
    const newGroup = await addGroup({
      description,
      title,
      photo,
      community_name,
    });
    res.status(201).json({
      status: "success",
      data: { group: newGroup },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "group",
        error: err.message,
      },
    });
  }
};

exports.joinGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const registerTo = await addRegisterTo({ userId, groupId });
    res.status(201).json({
      status: "success",
      data: { registerTo },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "registerTo",
        error: err.message,
      },
    });
  }
};

exports.leaveGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const removedRegisterTo = await removeRegisterTo(userId, groupId);
    if (!removedRegisterTo) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "User not found in the group",
      });
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "User has left the group",
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "leave group",
        error: err.message,
      },
    });
  }
};

// DELETE group/:groupId
exports.deleteGroup = async (req, res) => {
  const { groupId } = req.query;
  try {
    const deletedGroup = await deleteGroup(+groupId);
    if (!deletedGroup) {
      return res
        .status(404)
        .json({ status: httpStatusText.FAIL, data: { deletedGroup: null } });
    }
    return res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { deletedGroup } });
  } catch (err) {
    console.log("delete group: ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "delete group",
        error: err.message,
      },
    });
  }
};

exports.editGroup = async (req, res) => {
  const { groupId } = req.params;
  const { description, title, photo, community_name } = req.body;

  try {
    const updatedGroup = await updateGroupById(groupId, {
      description,
      title,
      photo,
      community_name,
    });

    res.status(200).json({
      status: "success",
      data: { group: updatedGroup },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "group",
        error: err.message,
      },
    });
  }
};
