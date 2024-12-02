const express = require("express");
const communityController = require("../controllers/communityController");

const router = express.Router();

router.post("/", communityController.createCommunity);
router.post("/join", communityController.joinCommunity);
router.get("/", communityController.getAllCommunities);
router.get("/user/:userId", communityController.getUserCommunities);
router.post("/groups", communityController.getGroupsByCommunity);
router.get("/search", communityController.searchCommunitiesByName); // Add this line
router.patch('/:communityName/promote', communityController.promoteUser);

module.exports = router;