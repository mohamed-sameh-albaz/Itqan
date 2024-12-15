const express = require("express");
const socialController = require("../controllers/socialController");
const router = express.Router();

router
  .route("/").get(socialController.getPosts).post(socialController.createPost).delete(socialController.deletePost);
router
  .route("/comments").post(socialController.addComment).get(socialController.getComments);
router
  .route("/user").get(socialController.getUserPosts).put(socialController.editPost);
router
  .route("/comments/:commentId").delete(socialController.deleteComment);
router
  .route('/like')
  .post(socialController.like);
router
  .route('/dislike')
  .delete(socialController.dislike);
module.exports = router;
