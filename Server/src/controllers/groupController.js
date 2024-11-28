const { addGroup } = require("../models/groupModel");
const { addRegisterTo } = require("../models/registersToModel");

exports.createGroup = async (req, res) => {
  const { description, title, photo, comm_id } = req.body;

  try {
    const newGroup = await addGroup({ description, title, photo, comm_id });
    res.status(201).json({ group: newGroup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const registerTo = await addRegisterTo({ userId, groupId });
    res.status(201).json({ registerTo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};