const db = require("../config/db");

exports.createPost = async (title, userId, communityId, text) => {
  const client = await db.connect();
  try {
    const query = `
      INSERT INTO Posts (title, user_id, comm_id, text_content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [title, userId, communityId, text]);
    return rows[0];
  } catch (err) {
    console.error(`Error creating post: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.addToPostContent = async(postId, content) => {
  const client = await db.connect();
  try {
    const query = `
    INSERT INTO PostContent (post_id, content)
    VALUES ($1, $2)
    RETURNING *;
    `;
    const { rows } = await db.query(query, [postId, content]);
    return rows[0];
  } catch (err) {
    console.error(`Error adding post content: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}

exports.getPostContent = async(postId) => {
  const client = await db.connect();
  try {
    const query = `
    SELECT content 
    FROM PostContent
    WHERE post_id = $1;
    `;
    const { rows } = await db.query(query, [postId]);
    return rows;
  } catch (err) {
    console.error(`Error retreving post content: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}


exports.getPosts = async (communityId, limit, offset) => {
  const client = await db.connect();
  try {
    const postsQuery = `
      SELECT p.*, u.fname, u.lname, u.photo, r.color
      FROM Posts AS p
      JOIN Users AS u ON u.id = p.user_id
      JOIN Community AS comm ON comm.id = p.comm_id
      JOIN joinAs AS ja ON ja.user_id = p.user_id AND ja.community_name = comm.name
      JOIN Roles AS r ON r.id = ja.role_id
      WHERE p.comm_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows: posts } = await db.query(postsQuery, [communityId, limit, offset]);
    const countQuery = `
      SELECT COUNT (*)
      FROM Posts
      WHERE comm_id = $1;
    `;
    const { rows: countRows } = await db.query(countQuery, [communityId]);
    const totalCount = parseInt(countRows[0].count, 10);
    return { posts, totalCount };
  } catch (err) {
    console.error(`Error retreving posts: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getPostComments = async (post_id, limit, offset) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT pc.*, u.fname, u.lname, u.photo, r.color
      FROM PostComments AS pc
      JOIN Users AS u ON u.id = pc.user_id  
      JOIN Posts AS p ON p.id = pc.post_id
      JOIN Community AS comm ON comm.id = p.comm_id
      JOIN joinAs AS ja ON ja.user_id = p.user_id AND ja.community_name = comm.name
      JOIN Roles AS r ON r.id = ja.role_id
      WHERE post_id = $1
      ORDER BY created_at DESC
    `;
    if(limit) {
      query += `LIMIT $2 OFFSET $3;`;
      const { rows: comments } = await db.query(query, [post_id, limit, offset]);
      return comments;
    } else {
      query += `LIMIT 10;`;
      const { rows: comments } = await db.query(query, [post_id]);
      return comments ;
    }
  } catch (err) {
    console.error(`Error retreving comments: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}

exports.getUserPosts = async (userId, communityId, limit, offset) => {
  const client = await db.connect();
  try {
    const postsQuery = `
      SELECT p.*
      FROM Posts AS p
      WHERE p.comm_id = $1 AND p.user_id = $2
      ORDER BY p.created_at DESC  
      LIMIT $3 OFFSET $4
    `;
    const { rows: posts } = await db.query(postsQuery, [communityId, userId, limit, offset]);
    const countQuery = `
      SELECT COUNT (*)
      FROM Posts
      WHERE comm_id = $1 AND user_id = $2;
    `;
    const { rows: countRows } = await db.query(countQuery, [communityId, userId]);
    const totalCount = parseInt(countRows[0].count, 10);
    return { posts, totalCount };
  } catch (err) {
    console.error(`Error retreving user posts: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.deletePost = async (userId, postId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM Posts
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [postId, userId]);
    return rows;
  } catch (err) {
    console.error(`Error deleting team members: ${err}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.editPost = async (userId, postId, title, images, text_content) => {
  const client = await db.connect();
  try {
    const updateQuery = `
      UPDATE Posts
      SET title = $1, text_content = $2, updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING *;
    `;
    const { rows: updatedPost } = await db.query(updateQuery, [title, text_content, postId, userId]);
    const updateContentQuery = `
      UPDATE PostContent
      SET content = $1
      WHERE post_id = $2
      RETURNING *;
    `;
    const { rows: updatedContent} = await db.query(updateContentQuery, [JSON.stringify(images), postId]);
    updatedPost[0].images = JSON.parse(updatedContent[0].content);
    return updatedPost;
  } catch (err) {
    console.error(`Error editing post: ${err.message}`);
    throw new Error("Database error: Unable to edit post");
  } finally {
    client.release();
  }
};

exports.like = async (postId, userId) => {
  const client = await db.connect();
  try {
    const query = `
      INSERT INTO PostLikes (user_id, post_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, postId]);
    return rows[0];
  } catch (err) {
    console.error(`Error like post: ${err.message}`);
    throw new Error("Database error: Unable to like post");
  } finally {
    client.release();
  }
}

exports.dislike = async (postId, userId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM PostLikes
      WHERE user_id = $1 AND post_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, postId]);
    return rows[0];
  } catch (err) {
    console.error(`Error dislike post: ${err.message}`);
    throw new Error("Database error: Unable to dislike post");
  } finally {
    client.release();
  }
}

exports.isLiked = async (postId, userId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT *
      FROM PostLikes
      WHERE post_id = $1 AND user_id = $2;
    `;
    const { rows } = await db.query(query, [postId, userId]);
    return rows;
  } catch (err) {
    console.error(`Error like post: ${err.message}`);
    throw new Error("Database error: Unable to like post");
  } finally {
    client.release();
  }
}


exports.getPostLikes = async(postId) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT COUNT(*)
      FROM PostLikes
      WHERE post_id = $1;
    `;
    const { rows } = await db.query(query, [postId]);
    const totalCount = parseInt(rows[0].count, 10);
    return totalCount;
  } catch (err) {
    console.error(`Error retreving comments: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}

exports.addComment = async(postId, userId, content) => {
  const client = await db.connect();
  try {
    const query = `
      INSERT INTO PostComments (user_id, post_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, postId, content]);
    return rows[0];
  } catch (err) {
    console.error(`Error comment on post: ${err.message}`);
    throw new Error("Database error: Unable to comment on post");
  } finally {
    client.release();
  }
}

exports.deleteComment = async(commentId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM PostComments 
      WHERE comment_id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [commentId]);
    return rows[0];
  } catch (err) {
    console.error(`Error deleting comment on post: ${err.message}`);
    throw new Error("Database error: Unable to delete comment");
  } finally {
    client.release();
  }
}

exports.checkUserComment = async(userId, postId, commentId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT * 
      FROM PostComments 
      WHERE comment_id = $1 AND user_id = $2 AND post_id = $3;
    `;
    const { rows } = await db.query(query, [commentId, userId, postId]);
    return rows;
  } catch (err) {
    console.error(`Error deleting comment on post: ${err.message}`);
    throw new Error("Database error: Unable to delete comment");
  } finally {
    client.release();
  }
}

