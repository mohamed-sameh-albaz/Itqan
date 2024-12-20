const db = require("../config/db");

exports.submitTask = async (taskId, userId, teamId, content, contestType, taskType) => {
  const client = await db.connect();
  try {
    let query = `
      INSERT INTO Submissions (status, content, task_id, score)`;
    if (taskType === "mcq") {
      query += `VALUES ('Approved', $1, $2, 0)`;
    } else {
      query += `VALUES ('pending', $1, $2, 0)`;
    }
    query += `
    RETURNING *;
    `;
    const { rows: submission } = await db.query(query, [content, taskId]);

    query = `INSERT INTO `;
    const params = [submission[0].id];
    if (contestType === "team") {
      query += `
      TeamSubmissions (submission_id, team_id)
      VALUES ($1, $2)
      RETURNING *;
      `;
      params.push(teamId);
    } else {
      query += `
      SingleSubmissions (submission_id, individual_id)
      VALUES ($1, $2)
      RETURNING *;
      `;
      params.push(userId);
    }
    const { rows: submissionType } = await db.query(query, params);
    submission[0].submissionType = contestType;
    submission[0].taskType = taskType;
    return submission[0];
  } catch (err) {
    console.error("Error submit task:", err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.addTaskPoints = async (userId, points) => {
  const client = await db.connect();
  try {
    const query = `
      UPDATE Users
      SET points = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [points, userId]);
    return rows[0];
  } catch (err) {
    console.error("Error submit task:", err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getNotApprovedSubmissions = async (contestId, contestType) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT s.*`;
    if (contestType == "team") {
      query += `, sub.team_id`;
    } else {
      query += `, sub.individual_id`;
    }
    query += `
      FROM Submissions AS s
    `;
    if (contestType === "team") {
      query += `  JOIN TeamSubmissions AS sub ON sub.submission_id = s.id
      `;
    } else {
      query += `  JOIN SingleSubmissions AS sub ON sub.submission_id = s.id
      `;
    }
    query += `JOIN Tasks AS t ON t.id = s.task_id AND t.type = 'written'
      JOIN Contests AS c ON c.id = t.contest_id
      WHERE c.id = $1 AND s.approved_by IS NULL
      ORDER BY s.created_at DESC;
    `;
    console.log(query);
    const { rows } = await db.query(query, [contestId]);
    return rows;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getSubmissions = async (contestId, contestType) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT s.*, t.type AS task_type`;
    if (contestType == "team") {
      query += `, sub.team_id`;
    } else {
      query += `, sub.individual_id`;
    }
    query += `
      FROM Submissions AS s
    `;
    if (contestType === "team") {
      query += `  JOIN TeamSubmissions AS sub ON sub.submission_id = s.id
      `;
    } else {
      query += `  JOIN SingleSubmissions AS sub ON sub.submission_id = s.id
      `;
    }
    query += `JOIN Tasks AS t ON t.id = s.task_id
      JOIN Contests AS c ON c.id = t.contest_id
      WHERE c.id = $1
      ORDER BY s.created_at DESC;
    `;
    const { rows } = await db.query(query, [contestId]);
    return rows;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.approveSubmission = async ( userId, submissionId, score ) => {
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
    const { rows } = await db.query(query, [userId, score, submissionId]);
    return rows[0];
  } catch(err) {  
    console.error(err);
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

exports.getSubmitor = async (contestType, submissionId) => {
  const client = await db.connect();
  try {
    let query = `
      SELECT `;
    if(contestType === 'team') {
      query += `team_id
      FROM TeamSubmissions`;
    } else {
      query += `individual_id 
      FROM SingleSubmissions`;
    }
    query += `
      WHERE submission_id = $1;
    `;
    const { rows } = await db.query(query, [submissionId]);
    return rows[0];
  } catch(err) {  
    console.error(err.message);
    throw new Error(err.message);
  } finally {
    client.release();
  } 
}