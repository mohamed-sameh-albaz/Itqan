const { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, getUsersByCommunityName } = require("../models/communityModel");
const { addJoinAs } = require("../models/joinAsModel");
const { getGroupsByCommunity } = require("../models/groupModel");

exports.createCommunity = async (req, res) => {
  const { name, color, description, userId, roleId } = req.body;

  try {
    const newCommunity = await addCommunity({ name, color, description });
    const communityName = newCommunity.name;

    await addJoinAs({ userId, roleId: 1, communityName, approved: true });
    res.status(201).json({
      status: "success",
      data: { community: newCommunity }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      details: {
        field: "community",
        error: err.message
      }
    });
  }
};

exports.joinCommunity = async (req, res) => {
  const { userId, communityName, roleId } = req.body;

  try {
    const joinAs = await addJoinAs({ userId, roleId, communityName, approved: false });
    res.status(201).json({
      status: "success",
      data: { joinAs }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "joinAs",
        error: err.message
      }
    });
  }
};

exports.getAllCommunities = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await getAllCommunities(limit, offset);
    res.status(200).json({
      status: "success",
      data: { communities },
      pagination: {
        from: offset + 1,
        to: offset + communities.length,
        current_page: page,
        total: totalCount,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "communities",
        error: err.message
      }
    });
  }
};

exports.getUserCommunities = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { userCommunities, totalCount } = await getUserCommunities(userId, limit, offset);
    res.status(200).json({
      status: "success",
      data: { communities: userCommunities },
      pagination: {
        from: offset + 1,
        to: offset + userCommunities.length,
        current_page: page,
        total: totalCount,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "userCommunities",
        error: err.message
      }
    });
  }
};

exports.getGroupsByCommunity = async (req, res) => {
  const { community_name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { groups, totalCount } = await getGroupsByCommunity(community_name, limit, offset);
    res.status(200).json({
      status: "success",
      data: { groups },
      pagination: {
        from: offset + 1,
        to: offset + groups.length,
        current_page: page,
        total: totalCount,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "groups",
        error: err.message
      }
    });
  }
};

exports.searchCommunitiesByName = async (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await searchCommunitiesByName(name, limit, offset);
    res.status(200).json({
      status: "success",
      data: { communities },
      pagination: {
        from: offset + 1,
        to: offset + communities.length,
        current_page: page,
        total: totalCount,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "communities",
        error: err.message
      }
    });
  }
};

exports.getUsersByCommunityName = async (req, res) => {
  const { community_name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { users, totalCount } = await getUsersByCommunityName(community_name, limit, offset);
    res.status(200).json({
      status: "success",
      data: { users },
      pagination: {
        from: offset + 1,
        to: offset + users.length,
        current_page: page,
        total: totalCount,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "users",
        error: err.message
      }
    });
  }
};