const db = require("../config/db");

const getAllRewards = async (limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: rewards } = await db.query(
      "SELECT * FROM Rewards LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM Rewards");
    const totalCount = parseInt(countRows[0].count, 10);
    return { rewards, totalCount };
  } catch (err) {
    console.error(`Error retrieving rewards: ${err.message}`);
    throw new Error("Database error: Unable to retrieve rewards");
  } finally {
    client.release();
  }
};

const addReward = async (reward) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Rewards (description, type, name, image) VALUES ($1, $2, $3, $4) RETURNING *`,
      [reward.description, reward.type, reward.name, reward.image]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding reward: ${err.message}`);
    throw new Error("Database error: Unable to add reward");
  } finally {
    client.release();
  }
};

const updateRewardById = async (rewardId, reward) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE Rewards SET description = $1, type = $2, name = $3, image = $4 WHERE id = $5 RETURNING *`,
      [reward.description, reward.type, reward.name, reward.image, rewardId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating reward: ${err.message}`);
    throw new Error("Database error: Unable to update reward");
  } finally {
    client.release();
  }
};

const deleteRewardById = async (rewardId) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM Rewards WHERE id = $1", [rewardId]);
  } catch (err) {
    console.error(`Error deleting reward: ${err.message}`);
    throw new Error("Database error: Unable to delete reward");
  } finally {
    client.release();
  }
};

const getUserRewards = async (userId, limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: rewards } = await db.query(
      `SELECT rewards.* 
       FROM ((users 
       JOIN levels ON levels.pointsThreshold <= users.points) 
       JOIN rewards ON rewards.id = levels.reward_id) 
       WHERE users.id = $1 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) 
       FROM ((users 
       JOIN levels ON levels.pointsThreshold <= users.points) 
       JOIN rewards ON rewards.id = levels.reward_id) 
       WHERE users.id = $1`,
      [userId]
    );
    const totalCount = parseInt(countRows[0].count, 10);
    return { rewards, totalCount };
  } catch (err) {
    console.error(`Error retrieving user rewards: ${err.message}`);
    throw new Error("Database error: Unable to retrieve user rewards");
  } finally {
    client.release();
  }
};

module.exports = { getAllRewards, addReward, updateRewardById, deleteRewardById, getUserRewards };