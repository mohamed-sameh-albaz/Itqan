const express = require("express");
const levelController = require("../controllers/levelController");

const router = express.Router();

router.get("/", levelController.getLevels);
router.post("/", levelController.createLevel);
router.put("/:levelId", levelController.updateLevel);
router.delete("/:levelId", levelController.deleteLevel);

module.exports = router;