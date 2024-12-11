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
  -- Insert roles
    INSERT INTO Roles (name, description, color)
    VALUES 
    ('admin', 'Administrator with full access', '#FF0000'),
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
    WITH NewGroup AS (
      INSERT INTO Groups (description, title, photo, community_name)
      VALUES 
      ('The leading group in the Innovation Hub.', 'Leadership Group', 'group_pic.jpg', 'Innovation Hub')
      RETURNING id
    )

    -- Insert a contest for the group
    , NewContest AS (
      INSERT INTO Contests (description, type, difficulty, name, start_date, end_date, status, group_id)
      SELECT 
        'Solve tech puzzles and challenges', 
        'Individual', 
        'Hard', 
        'Tech Puzzle Contest', 
        '2024-12-15 09:00:00', 
        '2024-12-20 18:00:00', 
        'Active', 
        NewGroup.id
      FROM NewGroup
      RETURNING id
    )

    -- Insert tasks for the contest
    INSERT INTO Tasks (contest_id, approve_by, description, title, points, type, image)
    SELECT
      NewContest.id, 
      NULL, 
      'Solve a complex algorithm problem', 
      'Algorithm Challenge', 
      100, 
      'Coding', 
      'task1.png'
    FROM NewContest
    UNION ALL
    SELECT
      NewContest.id, 
      NULL, 
      'Fix bugs in the code snippet', 
      'Debugging Challenge', 
      80, 
      'Coding', 
      'task2.png'
    FROM NewContest;

    -- Register the user to the group conducting the contest
    INSERT INTO registers_to (user_id, group_id)
    SELECT 
      (SELECT id FROM NewUser), 
      (SELECT id FROM NewGroup);
  `;
  await client.query(query);
  console.log("testing Vals created successfully!");
};
setupDatabase();
