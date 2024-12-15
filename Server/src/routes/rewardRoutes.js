const express = require("express");
const rewardController = require("../controllers/rewardController");

const router = express.Router();

router.get("/", rewardController.getRewards);
router.post("/", rewardController.createReward);
router.put("/:rewardId", rewardController.updateReward);
router.delete("/:rewardId", rewardController.deleteReward);

module.exports = router;