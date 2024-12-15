const db = require("../config/db");

const getAllLevels = async (limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: levels } = await db.query(
      "SELECT * FROM Levels LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM Levels");
    const totalCount = parseInt(countRows[0].count, 10);
    return { levels, totalCount };
  } catch (err) {
    console.error(`Error retrieving levels: ${err.message}`);
    throw new Error("Database error: Unable to retrieve levels");
  } finally {
    client.release();
  }
};

const addLevel = async (level) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Levels (name, pointsThreshold, reward_id) VALUES ($1, $2, $3) RETURNING *`,
      [level.name, level.pointsThreshold, level.reward_id]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding level: ${err.message}`);
    throw new Error("Database error: Unable to add level");
  } finally {
    client.release();
  }
};

const updateLevelById = async (levelId, level) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE Levels SET name = $1, pointsThreshold = $2, reward_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [level.name, level.pointsThreshold, level.reward_id, levelId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating level: ${err.message}`);
    throw new Error("Database error: Unable to update level");
  } finally {
    client.release();
  }
};

const deleteLevelById = async (levelId) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM Levels WHERE id = $1", [levelId]);
  } catch (err) {
    console.error(`Error deleting level: ${err.message}`);
    throw new Error("Database error: Unable to delete level");
  } finally {
    client.release();
  }
};

module.exports = { getAllLevels, addLevel, updateLevelById, deleteLevelById };