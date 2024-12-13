const { addGroup } = require("../models/groupModel");
const { addRegisterTo } = require("../models/registersToModel");

exports.createGroup = async (req, res) => {
  const { description, title, photo, community_name } = req.body;

  try {
    const newGroup = await addGroup({ description, title, photo, community_name });
    res.status(201).json({
      status: "success",
      data: { group: newGroup }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "group",
        error: err.message
      }
    });
  }
};

exports.joinGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const registerTo = await addRegisterTo({ userId, groupId });
    res.status(201).json({
      status: "success",
      data: { registerTo }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "registerTo",
        error: err.message
      }
    });
  }
};