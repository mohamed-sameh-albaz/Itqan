const express = require("express");
const { createCommunity, joinCommunity, getAllCommunities, getUserCommunities, getGroupsByCommunity, searchCommunitiesByName } = require("../controllers/communityController");

const router = express.Router();

router.post("/", createCommunity);
router.post("/join", joinCommunity);
router.get("/", getAllCommunities);
router.get("/user/:userId", getUserCommunities);
router.post("/groups", getGroupsByCommunity);
router.get("/search", searchCommunitiesByName); // Add this line

module.exports = router;