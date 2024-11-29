const express = require("express");
const { createGroup, joinGroup } = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.post("/join", joinGroup);

module.exports = router;