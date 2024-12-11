const { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, promoteUser }= require("../models/communityModel");
const  { addJoinAs } = require("../models/joinAsModel");
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
  try {
    const communities = await getAllCommunities();
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserCommunities = async (req, res) => {
  const { userId } = req.params;

  try {
    const userCommunities = await getUserCommunities(userId);
    res.status(200).json(userCommunities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupsByCommunity = async (req, res) => {
  const { community_name } = req.body;

  try {
    const groups = await getGroupsByCommunity(community_name);
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchCommunitiesByName = async (req, res) => {
  const { name } = req.query;

  try {
    const communities = await searchCommunitiesByName(name);
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
    const promotedUser = await promoteUser({userEmail, newRole, communityName});
    res.status(200).json({
      message: `User with email: ${userEmail} successfully promoted`,
      data: promotedUser,
    });
  }catch(err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
};