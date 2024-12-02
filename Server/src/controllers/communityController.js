const communityModel = require("../models/communityModel");
const joinAsModel = require("../models/joinAsModel");
const groupModel = require("../models/groupModel");

exports.createCommunity = async (req, res) => {
  const { name, color, description, userId, roleId } = req.body;

  try {
    const newCommunity = await communityModel.addCommunity({ name, color, description });
    const communityName = newCommunity.name;

    await joinAsModel.addJoinAs({ userId, roleId: 1, communityName, approved: true });
    res.status(201).json({ community: newCommunity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinCommunity = async (req, res) => {
  const { userId, communityName, roleId } = req.body;

  try {
    const joinAs = await joinAsModel.addJoinAs({ userId, roleId, communityName, approved: false });
    res.status(201).json({ joinAs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await communityModel.getAllCommunities();
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserCommunities = async (req, res) => {
  const { userId } = req.params;

  try {
    const userCommunities = await communityModel.getUserCommunities(userId);
    res.status(200).json(userCommunities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupsByCommunity = async (req, res) => {
  const { community_name } = req.body;

  try {
    const groups = await groupModel.getGroupsByCommunity(community_name);
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchCommunitiesByName = async (req, res) => {
  const { name } = req.query;

  try {
    const communities = await communityModel.searchCommunitiesByName(name);
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /communities/:communityName/promote
exports.promoteUser = async (req, res) => {
  const {userEmail, newRole} = req.body;
  let {communityName} = req.params;
  communityName = communityName.replace(/-/g, ' ');
  try{
    const promotedUser = await communityModel.promoteUser({userEmail, newRole, communityName});
    res.status(200).json({
      message: `User with email: ${userEmail} successfully promoted`,
      data: promotedUser,
    });
  }catch(err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
};