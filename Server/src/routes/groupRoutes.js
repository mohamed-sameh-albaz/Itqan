const express = require("express");
const { createGroup, joinGroup, deleteGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.post("/join", joinGroup);
router.delete("/:groupId", deleteGroup);

module.exports = router;