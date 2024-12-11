const { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName } = require("../models/communityModel");
const { addJoinAs } = require("../models/joinAsModel");
const { getGroupsByCommunity } = require("../models/groupModel");

exports.createCommunity = async (req, res) => {
  const { name, color, description, userId, roleId } = req.body;

  try {
    const newCommunity = await addCommunity({ name, color, description });
    const communityName = newCommunity.name;

    await addJoinAs({ userId, roleId: 1, communityName, approved: true });
    res.status(201).json({ community: newCommunity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinCommunity = async (req, res) => {
  const { userId, communityName, roleId } = req.body;

  try {
    const joinAs = await addJoinAs({ userId, roleId, communityName, approved: false });
    res.status(201).json({ joinAs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCommunities = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await getAllCommunities(limit, offset);
    res.status(200).json({ communities, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserCommunities = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { userCommunities, totalCount } = await getUserCommunities(userId, limit, offset);
    res.status(200).json({ userCommunities, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupsByCommunity = async (req, res) => {
  const { community_name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { groups, totalCount } = await getGroupsByCommunity(community_name, limit, offset);
    res.status(200).json({ groups, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchCommunitiesByName = async (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await searchCommunitiesByName(name, limit, offset);
    res.status(200).json({ communities, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};