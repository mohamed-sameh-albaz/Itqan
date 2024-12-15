const db = require("../config/db");

exports.getAllUsers = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users");
    return rows;
  } catch (err) {
    console.error(`Error retrieving users: ${err.message}`);
    throw new Error("Database error: Unable to retrieve users");
  } finally {
    client.release();
  }
};

exports.addUser = async (user) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO users (fname, lname, email, bio, password, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.bio,
        user.password,
        user.photo,
      ]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding user: ${err.message}`);
    throw new Error("Database error: Unable to add user");
  } finally {
    client.release();
  }
};

exports.findUserByEmail = async (email) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  } catch (err) {
    console.error(`Error finding user: ${err.message}`);
    throw new Error("Database error: Unable to find user");
  } finally {
    client.release();
  }
};

exports.leaveTeam = async (userId, teamId) => {
  const client = await db.connect();
  try {
    const query = `
      DELETE FROM user_team
      WHERE user_id = $1 AND team_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, teamId]);
    return rows;
  } catch (err) {
    console.error(`Error leaving team: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.updateUser = async (user) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE users SET
        fname = $1,
        lname = $2,
        email = $3,
        bio = $4,
        password = COALESCE($5, password),
        photo = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *`,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.bio,
        user.password,
        user.photo,
        user.userId
      ]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating user: ${err.message}`);
    throw new Error("Database error: Unable to update user");
  } finally {
    client.release();
  }
};

exports.deleteUser = async (userId) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
  } catch (err) {
    console.error(`Error deleting user: ${err.message}`);
    throw new Error("Database error: Unable to delete user");
  } finally {
    client.release();
  }
};
exports.approveSubmission = async ({ userId, submissionId, score }) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE Submissions  
      SET approved_by = $1,
        score = $2,
        approved_at = CURRENT_TIMESTAMP,
        status = 'Approved'
      WHERE id = $3
      RETURNING *;
    `;
    console.log({ userId, submissionId, score });
    const { rows } = await db.query(query, [userId, score, submissionId]);
    // console.log(rows);
    return rows;
  } catch(err) {  
    console.error(err);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}
