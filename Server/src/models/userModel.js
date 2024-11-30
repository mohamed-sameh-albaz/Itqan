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

exports.promoteUser = async (userId, communityName) => {
  const client = await db.connect();
  try {
    const getUsersQuery = `
    SELECT * FROM JoinAs
    WHERE user_id = $1 AND community_name = $2;  
    `;
    const adminRoleQuery = `
    SELECT id FROM Roles WHERE name = 'admin';
    `;

    let adminRoleId = await db.query(adminRoleQuery);
    adminRoleId = adminRoleId.rows[0].id;

    const valsForUpdate = [userId * 1, communityName];
    let { rows } = await db.query(getUsersQuery, valsForUpdate);
    if (!rows.length) {
      throw new Error("User not found in this community");
    }
    if (rows[0].role_id === adminRoleId) {
      throw new Error('User already has the Admin role');
    }
    const updateQuery = `
    UPDATE JoinAs
    SET role_id = $3
    WHERE user_id = $1 AND community_name = $2;
    `;
    valsForUpdate.push(adminRoleId);
    console.log(valsForUpdate);
    rows = await db.query(updateQuery, valsForUpdate);
    return {
      status: true,
      message: `User Promoted to Admin in ${communityName}`,
    };
  } catch (err) {
    console.error(`Error retrieving JoinAs: ${err.message}`);
    return {
      status: false,
      message: err.message,
    };
  } finally {
    client.release();
  }
};
