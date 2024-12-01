const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

const createTableScript = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);

const setupDatabase = async () => {
  const client = await pool.connect();
  // console.log(createTableScript); // testing
  try {
    await client.query(createTableScript);
    console.log("Tables created successfully!");
    await test(client);
  } catch (err) {
    console.error("Error during table creation:", err.message);
  } finally {
    client.release();
  }
};

// ============== testing ==============
const test = async (client) => {
  const query = `
  INSERT INTO Roles (name, description, color)
  VALUES ('admin', 'Administrator with full access', '#FF0000'),
    ('leader', 'Moderator with limited admin privileges', '#FFA500'),
    ('member', 'Regular member of the community', '#0000FF');
    -- Insert a new user and retrieve the user ID
    WITH NewUser AS (
      INSERT INTO Users (email, password, fname, lname, bio, points, photo) 
      VALUES 
      ('jane.doe@example.com', 'hashed_password', 'Jane', 'Doe', 'Community leader.', 50, 'profile_pic.jpg')
      RETURNING id
    ),

    -- Insert a new community and retrieve the community name
    NewCommunity AS (
      INSERT INTO Community (name, color, description) 
      VALUES 
      ('Innovation Hub', '#1ABC9C', 'A hub for innovation and creative thinkers.')
      RETURNING name
    ),

    -- Get the admin role ID
    AdminRole AS (
      SELECT id AS role_id FROM Roles WHERE name = 'admin'
    )

    -- Insert into joinAs table to link the user as admin of the new community
    INSERT INTO joinAs (user_id, role_id, community_name, approved)
    SELECT NewUser.id, AdminRole.role_id, NewCommunity.name, true
    FROM NewUser, AdminRole, NewCommunity;

    -- Insert a new group in the community
    INSERT INTO Groups (description, title, photo, community_name)
    VALUES 
    ('The leading group in the Innovation Hub.', 'Leadership Group', 'group_pic.jpg', 'Innovation Hub');
  `;
  await client.query(query);
  console.log("testing Vals created successfully!");
};
setupDatabase();
