const express = require("express");
const socialController = require("../controllers/socialController");
const { getCommunityId } = require("../middlewares/getCommunityId");
const router = express.Router();

router
  .route("/")
  .get(getCommunityId,socialController.getPosts)
  .post(getCommunityId, socialController.createPost)
  .delete(socialController.deletePost);
router
  .route("/comments")
  .post(socialController.addComment)
  .get(socialController.getComments);
router
  .route("/user")
  .get(getCommunityId,socialController.getUserPosts)
  .put(socialController.editPost);
router.route("/comments/:commentId").delete(socialController.deleteComment);
router.route("/like").post(socialController.like);
router.route("/dislike").delete(socialController.dislike);
module.exports = router;
