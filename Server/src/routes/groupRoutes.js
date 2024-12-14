const express = require("express");
const { createGroup, joinGroup, deleteGroup, editGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.post("/join", joinGroup);
router.route("/").delete(deleteGroup);
router.put("/:groupId", editGroup);

module.exports = router;