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

const getContestsByStatus = async ({ community_id, group_id, status, limit }) => {
  const client = await db.connect();
  try {
    let query = `SELECT * FROM contests WHERE `;
    const params = [];

    if (community_id) {
      query += `group_id IN (SELECT id FROM Groups WHERE comm_id = $1) AND `;
      params.push(community_id);
    } else if (group_id) {
      query += `group_id = $1 AND `;
      params.push(group_id);
    }

    switch (status) {
      case 'upcoming':
        query += `start_date > NOW() `;
        break;
      case 'running':
        query += `start_date <= NOW() AND end_date >= NOW() `;
        break;
      case 'pending':
        query += `end_date < NOW() AND status = 'pending' `;
        break;
      case 'finished':
        query += `end_date < NOW() AND status = 'finished' `;
        break;
      default:
        throw new Error("Invalid status");
    }

    query += `ORDER BY start_date ASC`;

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    const { rows } = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error(`Error retrieving contests by status: ${err.message}`);
    throw new Error("Database error: Unable to retrieve contests by status");
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

module.exports = { getAllContests, addContest, getContestsByStatus, updateContestById, deleteContestById };