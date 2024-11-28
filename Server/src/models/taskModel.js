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
      `INSERT INTO tasks (contest_id, description, title, points, image) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [task.contest_id, task.description, task.title, task.points, task.image]
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
      `UPDATE tasks SET contest_id = $1, description = $2, title = $3, points = $4, image = $5, type = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
      [task.contest_id, task.description, task.title, task.points, task.image, task.type, id]
    );
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