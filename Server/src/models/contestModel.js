const db = require("../config/db");

const getAllContests = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM contests");
    return rows;
  } catch (err) {
    console.error(`Error retrieving contests: ${err.message}`);
    throw new Error("Database error: Unable to retrieve contests");
  } finally {
    client.release();
  }
};

const addContest = async (contest) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO contests (description, type, difficulty, name, start_date, end_date, status, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [contest.description, contest.type, contest.difficulty, contest.name, contest.start_date, contest.end_date, contest.status, contest.group_id]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding contest: ${err.message}`);
    throw new Error("Database error: Unable to add contest");
  } finally {
    client.release();
  }
};

const updateContestById = async (id, contest) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE contests SET description = $1, type = $2, difficulty = $3, name = $4, start_date = $5, end_date = $6, status = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *`,
      [contest.description, contest.type, contest.difficulty, contest.name, contest.start_date, contest.end_date, contest.status, id]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating contest: ${err.message}`);
    throw new Error("Database error: Unable to update contest");
  } finally {
    client.release();
  }
};

const deleteContestById = async (id) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM contests WHERE id = $1", [id]);
  } catch (err) {
    console.error(`Error deleting contest: ${err.message}`);
    throw new Error("Database error: Unable to delete contest");
  } finally {
    client.release();
  }
};

module.exports = { getAllContests, addContest, updateContestById, deleteContestById };