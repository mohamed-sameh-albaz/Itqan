const express = require("express");
const { createCommunity, joinCommunity, getAllCommunities, getUserCommunities, getGroupsByCommunity, searchCommunitiesByName, getUsersByCommunityName } = require("../controllers/communityController");

const router = express.Router();

router.post("/", createCommunity);
router.post("/join", joinCommunity);
router.get("/", getAllCommunities);
router.get("/user", getUserCommunities);
router.get("/groups", getGroupsByCommunity);
router.get("/search", searchCommunitiesByName);
router.get("/users", getUsersByCommunityName);

module.exports = router;