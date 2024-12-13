const express = require("express");
const { createCommunity, joinCommunity, getAllCommunities, getUserCommunities, getGroupsByCommunity, searchCommunitiesByName, getUsersByCommunityName, promoteUser } = require("../controllers/communityController");

const router = express.Router();

router.post("/", createCommunity);
router.post("/join", joinCommunity);
router.get("/", getAllCommunities);
router.get("/user", getUserCommunities);
router.get("/groups", getGroupsByCommunity);
router.get("/search", searchCommunitiesByName);
router.get("/users", getUsersByCommunityName);
router.route('/users/promote').patch(promoteUser);

module.exports = router;