const express = require("express");
const { createCommunity, joinCommunity, getAllCommunities, getUserCommunities, getGroupsByCommunity, searchCommunitiesByName, promoteUser } = require("../controllers/communityController");

const router = express.Router();

router.post("/", createCommunity);
router.post("/join", joinCommunity);
router.get("/", getAllCommunities);
router.get("/user/:userId", getUserCommunities);
router.post("/groups", getGroupsByCommunity);
router.get("/search", searchCommunitiesByName); // Add this line
router.patch('/:communityName/promote', promoteUser);

module.exports = router;