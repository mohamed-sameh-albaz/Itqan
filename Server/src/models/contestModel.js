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
    const now = new Date();
    let status;

    if (new Date(contest.start_date) > now) {
      status = 'upcoming';
    } else if (new Date(contest.start_date) <= now && new Date(contest.end_date) >= now) {
      status = 'running';
    } else if (new Date(contest.end_date) < now) {
      status = 'finished';
    }

    const { rows } = await db.query(
      `INSERT INTO contests (description, type, difficulty, name, start_date, end_date, status, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [contest.description, contest.type, contest.difficulty, contest.name, contest.start_date, contest.end_date, status, contest.group_id]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding contest: ${err.message}`);
    throw new Error("Database error: Unable to add contest");
  } finally {
    client.release();
  }
};

const updateContestStatus = async (contestId, status) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE contests 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, contestId]);
    return rows[0];
  } catch (err) {
    console.error(`Error updating contest status: ${err.message}`);
    throw new Error("Database error: Unable to update contest status");
  } finally {
    client.release();
  }
};

const getContestsByStatus = async ({ community_name, group_id, status, limit }) => {
  const client = await db.connect();
  try {
    // Fetch all contests first
    let query = `SELECT * FROM contests WHERE `;
    const params = [];

    if (community_name) {
      query += `group_id IN (SELECT id FROM Groups WHERE community_name = $1) AND `;
      params.push(community_name);
    } else if (group_id) {
      query += `group_id = $1 AND `;
      params.push(group_id);
    }

    query += `1=1 ORDER BY start_date ASC`;

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    const { rows: contests } = await db.query(query, params);

    // Update the status of each contest based on the start date and end date
    const now = new Date();
    for (const contest of contests) {
      let newStatus;
      if (new Date(contest.start_date) > now) {
        newStatus = 'upcoming';
      } else if (new Date(contest.start_date) <= now && new Date(contest.end_date) >= now) {
        newStatus = 'running';
      } else if (new Date(contest.end_date) < now && contest.status === 'finished') {
        newStatus = 'finished';
      } else if (new Date(contest.end_date) < now) {
        newStatus = 'pending';
      }
      if (newStatus && newStatus !== contest.status) {
        await updateContestStatus(contest.id, newStatus);
        contest.status = newStatus;
      }
    }

    // Filter contests by the requested status
    const filteredContests = contests.filter(contest => contest.status === status);

    return filteredContests;
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

const getSingleLeaderboard = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT u.id, u.fname, u.lname, u.photo, SUM(s.score) AS total_score
      FROM users u
      JOIN SingleSubmissions ss ON ss.individual_id = u.id
      JOIN Submissions s ON s.id = ss.submission_id
      JOIN tasks t ON s.task_id = t.id
      WHERE t.contest_id = $1
      GROUP BY u.id
      ORDER BY total_score DESC
      limit 10
      ;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows;
  } catch (err) {
    console.error(`Error retrieving leaderboard: ${err.message}`);
    throw new Error("Database error: Unable to retrieve leaderboard");
  } finally {
    client.release();
  }
};

const getTeamLeaderboard = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT t.id, t.name, t.photo, SUM(s.score) AS total_score
      FROM teams t
      JOIN teamSubmissions ts ON ts.team_id = t.id
      JOIN Submissions s ON s.id = ts.submission_id
      JOIN tasks ta ON s.task_id = ta.id
      WHERE ta.contest_id = $1
      GROUP BY t.id
      ORDER BY total_score DESC
      LIMIT 10;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows;
  } catch (err) {
    console.error(`Error retrieving team leaderboard: ${err.message}`);
    throw new Error("Database error: Unable to retrieve team leaderboard");
  } finally {
    client.release();
  }
};

const getTasksByContestId = async (contestId, editing) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT tasks.*, mcqtasks.a, mcqtasks.b, mcqtasks.c, mcqtasks.d
    `;
    if (editing === 'true') {
      query += `, mcqtasks.right_answer`;
    }
    query += `
      FROM tasks
      LEFT OUTER JOIN mcqtasks ON tasks.id = mcqtasks.id
      WHERE contest_id = $1;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows;
  } catch (err) {
    console.error(`Error retrieving tasks by contest ID: ${err.message}`);
    throw new Error("Database error: Unable to retrieve tasks by contest ID");
  } finally {
    client.release();
  }
};

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

const getContestById = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT *
      FROM contests
      WHERE id = $1;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows[0];
  } catch (err) {
    console.error(`Error retrieving contest by ID: ${err.message}`);
    throw new Error("Database error: Unable to retrieve contest by ID");
  } finally {
    client.release();
  }
};

const setContestStatus = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE contests 
      SET status = 'finished', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows[0];
  } catch (err) {
    console.error(`Error updating contest: ${err.message}`);
    throw new Error("Database error: Unable to update contest");
  } finally {
    client.release();
  }
}

const getContestCommunity = async (contestId) => {
  const client = await db.connect();
  try {
    const query = `
      SELECT g.community_name
      FROM Contests AS c
      JOIN Groups AS g ON g.id = c.group_id
      WHERE c.id = $1;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows[0];
  } catch (err) {
    console.error(`Error get contest contest: ${err.message}`);
    throw new Error("Database error: Unable to update contest");
  } finally {
    client.release();
  }

}
module.exports = { getAllContests, addContest, getContestsByStatus, updateContestById, deleteContestById, getSingleLeaderboard, getTeamLeaderboard, getTasksByContestId, getContestById, getContestType, getTaskType, getMcqRightAnswer, getTaskPoints, setContestStatus, updateContestStatus, getContestCommunity };

