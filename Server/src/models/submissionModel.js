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
    if(contestStatus !== "running") {
      // throw new Error("the contest is finished you cannot submit");
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
    // contestType= "single";
    console.log(contestType);
    // team submissions must be handled
    const submissionQuery = `
      INSERT INTO Submissions (task_id, content, status)
      VALUES ($1, $2, 'Pending')
      RETURNING *;
      `;
    const { rows: submissionRes } = await db.query(submissionQuery, [
      submissionParams.taskId,
      submissionParams.submittedData,
    ]);
    console.log(submissionRes);///////////
    console.log(contestType);///////////
    if(contestType === "team") {
      console.log(3333);
      const teamSubmissionQuery = `
        INSERT INTO TeamSubmissions (submission_id, team_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      console.log(submissionParams.teamId);
      const { rows: teamSubRes } = await db.query(teamSubmissionQuery, [
        submissionRes[0].id,
        submissionParams.teamId,
      ]);
      console.log("333333",teamSubRes);
    } else {
      // check if the user have regiestered to the group that conducts the contest
      const userGroupQuery = `
        SELECT r.user_id, r.group_id
        FROM Registers_to AS r
        INNER JOIN Contests AS c ON r.group_id = c.group_id
        WHERE r.user_id = $1 AND c.id = $2;
      `;
      const { rows: userGroupRes } = await db.query(userGroupQuery, [
        submissionParams.userId,
        submissionParams.contestId,
      ]);
      console.log(userGroupRes);
      if (!userGroupRes.length) {
        throw new Error("User is not in the contest's group");
      }
      
      const singleSubmissionQuery = `
        INSERT INTO SingleSubmissions (submission_id, individual_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const { rows: singleSubRes } = await db.query(singleSubmissionQuery, [
        submissionRes[0].id,
        submissionParams.userId,
      ]);
      console.log(singleSubRes);
    }


    // submit
    // console.log(singleSubRes);
    return { submissionRes };
  } catch (err) {
    console.error(`Error adding submission: ${err.message}`);
    throw new Error(`${err.message}`);
  } finally {
    client.release();
  }
};
