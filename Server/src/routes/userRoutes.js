const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getUserById);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/edit", userController.updateUser);
router.delete("/delete", userController.deleteUser);
router.get("/search", userController.searchUsers);

module.exports = router;
