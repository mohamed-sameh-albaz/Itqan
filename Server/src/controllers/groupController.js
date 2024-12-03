const { addGroup, deleteGroup } = require("../models/groupModel");
const { addRegisterTo } = require("../models/registersToModel");

exports.createGroup = async (req, res) => {
  const { description, title, photo, community_name } = req.body;

  try {
    const newGroup = await addGroup({ description, title, photo, community_name });
    res.status(201).json({ group: newGroup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { userId, groupId } = req.body; // how user will join without know the group name??

  try {
    const registerTo = await addRegisterTo({ userId, groupId });
    res.status(201).json({ registerTo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE group/:groupId
exports.deleteGroup = async (req, res) => {
  const {groupId} = req.params;
  const {userId} = req.body;
  try{
    const deletedGroup = await deleteGroup({groupId, userId});
    res.status(201).json({deletedGroup});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}