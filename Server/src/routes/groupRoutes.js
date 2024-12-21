const express = require("express");
const { createGroup, joinGroup, deleteGroup, editGroup, leaveGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.post("/join", joinGroup);
router.post("/leave", leaveGroup);
router.route("/").delete(deleteGroup);
router.put("/:groupId", editGroup);

module.exports = router;