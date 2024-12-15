const db = require("../config/db");

exports.getRoles = async () => {
  const client = await db.connect();
  try {
    const query = `
      SELECT *
      FROM Roles;
    `
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    console.error(`Error retreiving roles: ${err.message}`);
    throw new Error(err.message);
  } finally {
    client.release();
  }
}