const express = require("express");
const { createGroup, joinGroup, deleteGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.post("/join", joinGroup);
router.route("/").delete(deleteGroup);

module.exports = router;