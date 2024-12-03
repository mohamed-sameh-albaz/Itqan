const express = require("express");
const groupController = require("../controllers/groupController");

const router = express.Router();

router.post("/", groupController.createGroup);
router.post("/join", groupController.joinGroup);
router.delete("/:groupId", groupController.deleteGroup);

module.exports = router;