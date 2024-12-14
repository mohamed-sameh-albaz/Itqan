const express = require("express");
const socialController = require("../controllers/socialController");
const router = express.Router();

router
  .route("/").get(socialController.getPosts).post(socialController.createPost);
  // delete(socialController.deletePost);
router
  .route("/:userId").get(socialController.getUserPosts);
  // .put(socialController.editPost);
module.exports = router;
