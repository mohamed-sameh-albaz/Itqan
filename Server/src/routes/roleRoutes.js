const express = require("express");
const roleController = require("../controllers/roleController");

const router = express.Router();

router.get("/", roleController.getRoles);
router.post("/", roleController.createRole);
router.put("/:roleId", roleController.updateRole);
router.delete("/:roleId", roleController.deleteRole);

module.exports = router;