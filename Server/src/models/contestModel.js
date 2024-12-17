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

const getContestsByStatus = async ({ community_name, group_id, status, limit }) => {
  const client = await db.connect();
  try {
    let query = `SELECT * FROM contests WHERE `;
    const params = [];

    if (community_name) {
      query += `group_id IN (SELECT id FROM Groups WHERE community_name = $1) AND `;
      params.push(community_name);
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

const getContestType = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
    SELECT type 
    FROM Contests
    WHERE id = $1;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows[0].type;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally{
    client.release();
  }
}

const getTaskType = async (taskId) => {
  const client = await db.connect();
  try {
    const query = `
    SELECT type 
    FROM Tasks
    WHERE id = $1;
    `;
    const { rows } = await db.query(query, [taskId]);
    return rows[0].type;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally{
    client.release();
  }
}

const getMcqRightAnswer = async (taskId) => {
  const client = await db.connect();
  try {
    const query = `
    SELECT right_answer 
    FROM McqTasks
    WHERE id = $1;
    `;
    const { rows } = await db.query(query, [taskId]);
    return rows[0].right_answer;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally{
    client.release();
  }
}

const getTaskPoints = async (taskId) => {
  const client = await db.connect();
  try {
    const query = `
    SELECT points 
    FROM Tasks
    WHERE id = $1;
    `;
    const { rows } = await db.query(query, [taskId]);
    return rows[0].points;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally{
    client.release();
  }
}

module.exports = { getAllContests, addContest, getContestsByStatus, updateContestById, deleteContestById, getContestType, getTaskType, getMcqRightAnswer,getTaskPoints };