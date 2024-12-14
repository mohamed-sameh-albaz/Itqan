const db = require("../config/db");

exports.createPost = async (title, userId, communityId, text, images) => {
  const client = await db.connect();
  try {
    const createQuery = `
      INSERT INTO Posts (title, user_id, comm_id, text_content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows: createdPost } = await db.query(createQuery, [title, userId, communityId, text]);
    const contentQuery = `
    INSERT INTO PostContent (post_id, content)
    VALUES ($1, $2)
    RETURNING *;
    `;
    const { rows: postContent } = await db.query(contentQuery, [createdPost[0].id, JSON.stringify(images)]);
    createdPost[0].images = JSON.parse(postContent[0].content);
    return createdPost[0];
  } catch (err) {
    console.error(`Error creating post: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getPosts = async (communityId, limit, offset) => {
  const client = await db.connect();
  try {
    const postsQuery = `
      SELECT p.*, pc.content, u.fname, u.lname, u.photo, r.color, pco.comment_id
      FROM Posts AS p
      JOIN Users AS u ON u.id = p.user_id
      JOIN joinAs AS ja ON ja.user_id = p.user_id
      LEFT JOIN PostComments AS pco ON pco.post_id = p.id
      JOIN Roles AS r ON r.id = ja.role_id
      JOIN PostContent AS pc ON pc.post_id = p.id
      WHERE p.comm_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows: posts } = await db.query(postsQuery, [communityId, limit, offset]);
    // console.log(posts);
    const countQuery = `
      SELECT COUNT (*)
      FROM Posts
      WHERE comm_id = $1;
    `;
    const { rows: countRows } = await db.query(countQuery, [communityId]);
    const totalCount = parseInt(countRows[0].count, 10);
    // posts.content = JSON.parse(posts[0].content);
    return { posts, totalCount };
  } catch (err) {
    console.error(`Error retreving posts: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getUserPosts = async (userId, communityId, limit, offset) => {
  const client = await db.connect();
  try {
    const postsQuery = `
      SELECT p.*, pc.content_type, pc.content 
      FROM Posts AS p
      JOIN PostContent AS pc ON pc.post_id = p.id
      WHERE p.comm_id = $1 AND p.user_id = $2
      ORDER BY p.created_at DESC  
      LIMIT $3 OFFSET $4
    `;
    const { rows: posts } = await db.query(postsQuery, [communityId, userId, limit, offset,]);
    const countQuery = `
      SELECT COUNT (*)
      FROM Posts
      WHERE comm_id = $1 AND user_id = $2;
    `;
    const { rows: countRows } = await db.query(countQuery, [communityId, userId]);
    const totalCount = parseInt(countRows[0].count, 10);
    return { posts, totalCount };
  } catch (err) {
    console.error(`Error retreving posts: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.deletePost = async (teamId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM Teams
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [teamId]);
    return rows;
  } catch (err) {
    console.error(`Error deleting team members: ${err}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.editPost = async (userId, communityId, postId, title) => {
  const client = await db.connect();
  try {
    const updateQuery = `
      UPDATE Posts
      SET title = $1
      WHERE post_id = $2
      RETURNING *;
    `;
    const { rows: updatedPost } = await db.query(updateQuery, [title, postId]);
    return rows[0];
  } catch (err) {
    console.error(`Error editing team: ${err.message}`);
    throw new Error("Database error: Unable to edit team");
  } finally {
    client.release();
  }
};
