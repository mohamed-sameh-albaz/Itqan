const { addCommunity, getAllCommunities, getUserCommunities, searchCommunitiesByName, getUsersByCommunityName, promoteUser, updateCommunityById, removeCommunityById } = require("../models/communityModel");
const { addJoinAs, removeJoinAs } = require("../models/joinAsModel");
const { getGroupsByCommunity } = require("../models/groupModel");
const httpStatusText = require("../utils/httpStatusText");

exports.createCommunity = async (req, res) => {
  const { name, color, description, userId, roleId } = req.body;

  try {
    const newCommunity = await addCommunity({ name, color, description });
    const communityName = newCommunity.name;

    await addJoinAs({ userId, roleId: 1, communityName, approved: true });
    res.status(201).json({
      status: "success",
      data: { community: newCommunity },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      details: {
        field: "community",
        error: err.message,
      },
    });
  }
};

exports.joinCommunity = async (req, res) => {
  const { userId, communityName, roleId } = req.body;

  try {
    const joinAs = await addJoinAs({
      userId,
      roleId,
      communityName,
      approved: true,
    });
    res.status(201).json({
      status: "success",
      data: { joinAs },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "joinAs",
        error: err.message,
      },
    });
  }
};

exports.leaveCommunity = async (req, res) => {
  const { userId, communityName } = req.body;

  try {
    const result = await removeJoinAs(userId, communityName);
    if (result.message) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: result.message,
      });
    }
    if (!result) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "User not found in the community",
      });
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "User has left the community",
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "leave community",
        error: err.message,
      },
    });
  }
};

exports.getAllCommunities = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await getAllCommunities(
      userId,
      limit,
      offset
    );
    res.status(200).json({
      status: "success",
      data: { communities },
      pagination: {
        from: offset + 1,
        to: offset + communities.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "communities",
        error: err.message,
      },
    });
  }
};

exports.getUserCommunities = async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { userCommunities, totalCount } = await getUserCommunities(
      userId,
      limit,
      offset
    );
    res.status(200).json({
      status: "success",
      data: { communities: userCommunities },
      pagination: {
        from: offset + 1,
        to: offset + userCommunities.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "userCommunities",
        error: err.message,
      },
    });
  }
};

exports.getGroupsByCommunity = async (req, res) => {
  const { community_name, page = 1, limit = 10, userId } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { groups, totalCount } = await getGroupsByCommunity(
      community_name,
      userId,
      limit,
      offset,
    );
    res.status(200).json({
      status: "success",
      data: { groups },
      pagination: {
        from: offset + 1,
        to: offset + groups.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "groups",
        error: err.message,
      },
    });
  }
};

exports.searchCommunitiesByName = async (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { communities, totalCount } = await searchCommunitiesByName(
      name,
      limit,
      offset
    );
    res.status(200).json({
      status: "success",
      data: { communities },
      pagination: {
        from: offset + 1,
        to: offset + communities.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "communities",
        error: err.message,
      },
    });
  }
};

exports.getUsersByCommunityName = async (req, res) => {
  const { community_name, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { users, totalCount } = await getUsersByCommunityName(
      community_name,
      limit,
      offset
    );
    res.status(200).json({
      status: "success",
      data: { users },
      pagination: {
        from: offset + 1,
        to: offset + users.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "users",
        error: err.message,
      },
    });
  }
};

// PATCH /communities/Users/promote?communityName
exports.promoteUser = async (req, res) => {
  const {userId, communityName, roleId} = req.body;
  try{
    const promotedUser = await promoteUser( +userId, communityName, +roleId);
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { user: promotedUser } });
  } catch (err) {
    console.error("promote user: ", err.message);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "Promote user",
        error: err.message,
      },
    });
  }
};

exports.editCommunity = async (req, res) => {
  const { communityId } = req.params;
  const { name, color, description } = req.body;

  try {
    const updatedCommunity = await updateCommunityById(communityId, {
      name,
      color,
      description,
    });

    res.status(200).json({
      status: "success",
      data: { community: updatedCommunity },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "community",
        error: err.message,
      },
    });
  }
};

exports.deleteCommunity = async (req, res) => {
  const { communityId } = req.params;

  try {
    await removeCommunityById(communityId);
    res.status(200).json({
      status: "success",
      message: `Community with ID ${communityId} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      details: {
        field: "community",
        error: err.message,
      },
    });
  }
};
