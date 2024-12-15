const db = require("../config/db");

const getAllRoles = async (limit, offset) => {
  const client = await db.connect();
  try {
    const { rows: roles } = await db.query(
      "SELECT * FROM Roles LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM Roles");
    const totalCount = parseInt(countRows[0].count, 10);
    return { roles, totalCount };
  } catch (err) {
    console.error(`Error retrieving roles: ${err.message}`);
    throw new Error("Database error: Unable to retrieve roles");
  } finally {
    client.release();
  }
};

const addRole = async (role) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `INSERT INTO Roles (name, description, color) VALUES ($1, $2, $3) RETURNING *`,
      [role.name, role.description, role.color]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error adding role: ${err.message}`);
    throw new Error("Database error: Unable to add role");
  } finally {
    client.release();
  }
};

const updateRoleById = async (roleId, role) => {
  const client = await db.connect();
  try {
    const { rows } = await db.query(
      `UPDATE Roles SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [role.name, role.description, role.color, roleId]
    );
    return rows[0];
  } catch (err) {
    console.error(`Error updating role: ${err.message}`);
    throw new Error("Database error: Unable to update role");
  } finally {
    client.release();
  }
};

const deleteRoleById = async (roleId) => {
  const client = await db.connect();
  try {
    await db.query("DELETE FROM Roles WHERE id = $1", [roleId]);
  } catch (err) {
    console.error(`Error deleting role: ${err.message}`);
    throw new Error("Database error: Unable to delete role");
  } finally {
    client.release();
  }
};

module.exports = { getAllRoles, addRole, updateRoleById, deleteRoleById };