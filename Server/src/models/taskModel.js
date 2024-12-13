const db = require("../config/db");

const getAllTasks = async () => {
  const client = await db.connect();
  try {
    const { rows } = await db.query("SELECT * FROM tasks");
    return rows;
  } catch (err) {
    console.error(`Error retrieving tasks: ${err.message}`);
    throw new Error("Database error: Unable to retrieve tasks");
  } finally {
    client.release();
  }
};

const addTask = async (task) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO tasks (contest_id, description, title, points, image, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [task.contest_id, task.description, task.title, task.points, task.image, task.type]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding task: ${err.message}`);
    throw new Error("Database error: Unable to add task");
  } finally {
    client.release();
  }
};

const addMcqTask = async (mcqTask) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO mcqtasks (id, A, B, C, D, right_answer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [mcqTask.id, mcqTask.A, mcqTask.B, mcqTask.C, mcqTask.D, mcqTask.right_answer]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding MCQ task: ${err.message}`);
    throw new Error("Database error: Unable to add MCQ task");
  } finally {
    client.release();
  }
};

const updateTaskById = async (id, task) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE tasks SET description = $1, title = $2, points = $3, type = $4, image = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      [task.description, task.title, task.points, task.type, task.image, id]
    );

    if (task.type === 'mcq' && task.mcqData) {
      await db.query(
        `UPDATE mcqtasks SET A = $1, B = $2, C = $3, D = $4, right_answer = $5 WHERE id = $6`,
        [task.mcqData.A, task.mcqData.B, task.mcqData.C, task.mcqData.D, task.mcqData.right_answer, id]
      );
    }

    return rows[0];
  } catch (err) {
    console.error(`Error updating task: ${err.message}`);
    throw new Error("Database error: Unable to update task");
  } finally {
    client.release();
  }
};

const deleteTaskById = async (id) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
  } catch (err) {
    console.error(`Error deleting task: ${err.message}`);
    throw new Error("Database error: Unable to delete task");
  } finally {
    client.release();
  }
};

module.exports = { getAllTasks, addTask, addMcqTask, updateTaskById, deleteTaskById };