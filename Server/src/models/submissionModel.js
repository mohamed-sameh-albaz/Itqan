const db = require("../config/db");

exports.submitTask = async (submissionParams) => {
  const client = await db.connect();
  try {
    const contestQuery = `
      SELECT id, status, type 
      FROM Contests 
      Where id = $1; 
    `;
    const { rows: contestRes } = await db.query(contestQuery, [
      submissionParams.contestId,
    ]);
    if (!contestRes.length) {
      throw new Error("Contest not found");
    }
    const contestType = contestRes[0].type;
    
    const contestStatus = contestRes[0].status;
    // check that the contest is running
    if(contestStatus !== "active") {
      throw new Error("the contest is finished you cannot submit");
    }

    // check if the user have regiestered to the group that conducts the contest
    const userGroupQuery = `
      SELECT r.user_id, r.group_id 
      FROM Registers_to AS r, contests AS c
      WHERE r.user_id = $1 AND r.group_id = c.group_id AND c.id = $2; 
    `;
    const { rows: userGroupRes } = await db.query(userGroupQuery, [
      submissionParams.userId,
      submissionParams.contestId,
    ]);
    if (!userGroupRes.length) {
      throw new Error("User is not in the contest's group");
    }

    // verify if the task belongs to the specified contest
    const taskQuery = `
      SELECT id 
      FROM Tasks 
      WHERE id = $1 AND contest_id = $2;`;
    const { rows: taskRes } = await db.query(taskQuery, [
      submissionParams.taskId,
      submissionParams.contestId,
    ]);

    if (!taskRes.length) {
      throw new Error("Task not found in this contest.");
    }

    // submit
    const submissionQuery = `
      INSERT INTO Submissions (task_id, content)
      VALUES ($1, $2)
      RETURNING *;
      `;
    const { rows: submissionRes } = await db.query(submissionQuery, [
      submissionParams.taskId,
      submissionParams.submittedData,
    ]);

    // team submissions must be handled
    
    const singleSubmissionQuery = `
      INSERT INTO SingleSubmissions (individual_id)
      VALUES ($1)
      RETURNING *;
    `;
    const { rows: singleSubRes } = await db.query(singleSubmissionQuery, [
      submissionParams.userId,
    ]);
    // console.log(singleSubRes);
    return { submissionRes, singleSubRes };
  } catch (err) {
    console.error(`Error adding submission: ${err.message}`);
    throw new Error(`${err.message}`);
  } finally {
    client.release();
  }
};
