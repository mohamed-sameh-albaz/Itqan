const {
  createPost,
  getPosts,
  getUserPosts,
  editPost,
  deletePost,
  getPostComments,
  like,
  getPostLikes,
  isLiked,
  dislike,
  addComment,
  deleteComment,
  checkUserComment,
  addToPostContent,
  getPostContent,
} = require("../models/socialModel");
const httpStatusText = require("../utils/httpStatusText");

// POST /posts
exports.createPost = async (req, res) => {
  const { title, userId, communityId, text, images } = req.body;
  try {
    const newPost = await createPost(title, userId, communityId, text);
    newPost.images = [];
    for(let i = 0; i < images.length; ++i) {
      const PostContent = await addToPostContent(newPost.id, images[i]);
      newPost.images.push(PostContent.content);
    }
    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { post: newPost } });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "create post",
        error: err.message,
      },
    });
  }
};

// GET /posts?communityId&limit&page
exports.getPosts = async (req, res) => {
  const { communityId, page = 1, limit = 10, userId } = req.query;
  try {
    const offset = (page - 1) * limit;
    const { posts, totalCount } = await getPosts(communityId, limit, offset);

    for(let i = 0; i < posts.length; ++i) {
      const postsComments = await getPostComments(posts[i].id);
      const PostLikes = await getPostLikes(posts[i].id)
      const liked = await isLiked(posts[i].id, userId);
      const PostContent = await getPostContent(posts[i].id);
      posts[i].liked = liked.length;
      posts[i].likes = PostLikes;
      posts[i].comments = postsComments;
      posts[i].images = [];
      for(let j = 0; j < PostContent.length; ++j) {
        posts[i].images.push(PostContent[j].content);
      }
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { posts },
      pagination: {
        from: offset + 1,
        to: offset + posts.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get posts",
        error: err.message,
      },
    });
  }
};

// GET /posts/?userId&communityId&limit&page
exports.getUserPosts = async (req, res) => {
  const { communityId, limit, page, userId } = req.query;
  try {
    const offset = (page - 1) * limit;
    const { posts, totalCount } = await getUserPosts(userId, communityId, limit, offset);

    for(let i = 0; i < posts.length; ++i) {
      const postsComments = await getPostComments(posts[i].id);
      const PostLikes = await getPostLikes(posts[i].id)
      const liked = await isLiked(posts[i].id, userId);
      const PostContent = await getPostContent(posts[i].id);
      posts[i].liked = liked.length;
      posts[i].likes = PostLikes;
      posts[i].comments = postsComments;
      posts[i].images = [];
      for(let j = 0; j < PostContent.length; ++j) {
        posts[i].images.push(PostContent[j].content);
      }
    }
    
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { posts },
      pagination: {
        from: offset + 1,
        to: offset + posts.length,
        current_page: page,
        total: totalCount,
        per_page: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get user posts",
        error: err.message,
      },
    });
  }
};

// PUT /posts/:userId
exports.editPost = async (req, res) => {
  const { postId, title, images, text, userId } = req.body;
  try {
    const post = await editPost(userId, postId, title, images, text);

    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { post },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "edit post",
        error: err.message,
      },
    });
  }
};

// DELETE /posts
exports.deletePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const { post } = await deletePost(userId, postId);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { post },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "edit post",
        error: err.message,
      },
    });
  }
};

// posts/like
exports.like = async (req, res) => {
  const { userId, postId, state } = req.body;
  try {
    let likePost;
    if(state) {
      const liked = await isLiked(postId, userId);
      if(liked.length) {
        return res
          .status(200)
          .json({
            status: httpStatusText.SUCCESS,
          });
      } else {
        likePost  = await like(postId, userId);
      }
    } else {
      const disliked = await isLiked(postId, userId);
      if(!disliked.length) {
        return res
          .status(200)
          .json({
            status: httpStatusText.SUCCESS,
          });
      }
      else {
        likePost  = await dislike(postId, userId);
      }
    }
    const likesCount = await getPostLikes(postId);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { likePost, likesCount },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "post react",
        error: err.message,
      },
    });
  }
}

// DELETE /posts/dislike
exports.dislike = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const disliked = await isLiked(postId, userId);
    if(!disliked.length) {
      return res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message : "user already disLikes this post"
        });
    }
    const likePost  = await dislike(postId, userId);
    const likesCount = await getPostLikes(postId);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { likePost, likesCount },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "post dislike",
        error: err.message,
      },
    });
  }
}

// GET /posts/comments
exports.getComments = async (req, res) => {
  const { postId, limit, page } = req.query;
  try {
    const offset = (page - 1) * limit;
    const comments = await getPostComments(postId, limit, offset);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { comments },
      pagination: {
        from: offset + 1,
        to: offset + comments.length,
        current_page: page,
        total: comments.length,
        per_page: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "get post comments",
        error: err.message,
      },
    });
  }
};

// POST /posts/comments
exports.addComment = async(req, res) => {
  const { userId, postId, content } = req.body;
  try {
    if(content === "") {
      return res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message : "cannot comment with empty content *-*"
        });
    }
    const newComment = await addComment(postId, userId, content);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { comment: newComment },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "post react",
        error: err.message,
      },
    });
  }
}

// DELETE /posts/comments/:commentId
exports.deleteComment = async(req, res) => {
  const { commentId } = req.params;
  const { userId, postId } = req.body;
  try {
    const isUserComment = await checkUserComment(userId, postId, commentId);
    if(!isUserComment.length) {
      return res
        .status(400)
        .json({
          status: httpStatusText.FAIL,
          message : "cannot delete other user comment"
        });
    }
    const deletedComment = await deleteComment(commentId);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { comment: deletedComment },
    });
  } catch (err) {
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Server Error",
      details: {
        field: "delete comment",
        error: err.message,
      },
    });
  }
}
