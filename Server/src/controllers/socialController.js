const {
  createPost,
  getPosts,
  getUserPosts,
  editPost,
  deletePost,
  getPostComments,
} = require("../models/socialModel");
const httpStatusText = require("../utils/httpStatusText");

// POST /posts
exports.createPost = async (req, res) => {
  const { title, userId, communityId, text, images } = req.body;
  try {
    const newPost = await createPost(title, userId, communityId, text, images);
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
  const { communityId, page = 1, limit = 10 } = req.query;
  try {
    const offset = (page - 1) * limit;
    const { posts, totalCount } = await getPosts(communityId, limit, offset);
    console.log(posts);
    const postsObj = [];
    for(let i = 0; i < posts.length; ++i) {
      const postsComments = await getPostComments(posts[i].id, communityId);
      posts[i].comments = postsComments;
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

// GET /posts/:userId?communityId&limit&page
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const { communityId, limit, page } = req.query;
  try {
    const offset = (page - 1) * limit;
    const { posts, totalCount } = await getUserPosts(userId, communityId, limit, offset);
    res.status(201).json({
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
  const { userId } = req.params;
  const { communityId, postId, title, content } = req.body;
  try {
    const post = await editPost(userId, communityId, postId, title, content);
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
exports.editPost = async (req, res) => {
  const { userId, communityId, postId, title, content_type, content } = req.body;
  try {
    const { post } = await editPost(userId, communityId, postId, title);
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
