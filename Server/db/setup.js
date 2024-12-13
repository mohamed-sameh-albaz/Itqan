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
  // const query = `
  // INSERT INTO Roles (name, description, color)
  // VALUES ('admin', 'Administrator with full access', '#FF0000'),
  //   ('leader', 'Moderator with limited admin privileges', '#FFA500'),
  //   ('member', 'Regular member of the community', '#0000FF');
  //   -- Insert a new user and retrieve the user ID
  //   WITH NewUser AS (
  //     INSERT INTO Users (email, password, fname, lname, bio, points, photo) 
  //     VALUES 
  //     ('jane.doe@example.com', 'hashed_password', 'Jane', 'Doe', 'Community leader.', 50, 'profile_pic.jpg')
  //     RETURNING id
  //   ),

  //   -- Insert a new community and retrieve the community name
  //   NewCommunity AS (
  //     INSERT INTO Community (name, color, description) 
  //     VALUES 
  //     ('Innovation Hub', '#1ABC9C', 'A hub for innovation and creative thinkers.')
  //     RETURNING name
  //   ),

  //   -- Get the admin role ID
  //   AdminRole AS (
  //     SELECT id AS role_id FROM Roles WHERE name = 'admin'
  //   )

  //   -- Insert into joinAs table to link the user as admin of the new community
  //   INSERT INTO joinAs (user_id, role_id, community_name, approved)
  //   SELECT NewUser.id, AdminRole.role_id, NewCommunity.name, true
  //   FROM NewUser, AdminRole, NewCommunity;

  //   -- Insert a new group in the community
  //   INSERT INTO Groups (description, title, photo, community_name)
  //   VALUES 
  //   ('The leading group in the Innovation Hub.', 'Leadership Group', 'group_pic.jpg', 'Innovation Hub');
  // `;
  const query = `-- Insert dummy users
INSERT INTO Users (email, password, fname, lname, bio, points, photo) VALUES
('user1@example.com', 'hashed_password1', 'User', 'One', 'Bio of User One', 100, 'photo1.jpg'),
('user2@example.com', 'hashed_password2', 'User', 'Two', 'Bio of User Two', 200, 'photo2.jpg'),
('user3@example.com', 'hashed_password3', 'User', 'Three', 'Bio of User Three', 300, 'photo3.jpg');

-- Insert dummy communities
INSERT INTO Community (name, color, description) VALUES
('Community One', '#FF5733', 'Description of Community One'),
('Community Two', '#33FF57', 'Description of Community Two'),
('Community Three', '#3357FF', 'Description of Community Three');

-- Insert roles
INSERT INTO Roles (name, description, color) VALUES
('admin', 'Administrator with full access', '#FF0000'),
('leader', 'Moderator with limited admin privileges', '#FFA500'),
('member', 'Regular member of the community', '#0000FF');

-- Insert joinAs records
INSERT INTO joinAs (user_id, role_id, community_name, approved) VALUES
(1, 1, 'Community One', true),
(1, 2, 'Community Two', true),
(1, 3, 'Community Three', true),
(2, 2, 'Community One', true),
(2, 1, 'Community Two', true),
(2, 3, 'Community Three', true),
(3, 3, 'Community One', true),
(3, 3, 'Community Two', true),
(3, 1, 'Community Three', true);
INSERT INTO levels(name, pointsthreshold) values ('level One', 0);
-- Insert dummy groups for each community
INSERT INTO Groups (description, title, photo, community_name) VALUES
('Description of Group 1 in Community One', 'Group 1', 'group1.jpg', 'Community One'),
('Description of Group 2 in Community One', 'Group 2', 'group2.jpg', 'Community One'),
('Description of Group 3 in Community One', 'Group 3', 'group3.jpg', 'Community One'),
('Description of Group 1 in Community Two', 'Group 1', 'group1.jpg', 'Community Two'),
('Description of Group 2 in Community Two', 'Group 2', 'group2.jpg', 'Community Two'),
('Description of Group 3 in Community Two', 'Group 3', 'group3.jpg', 'Community Two'),
('Description of Group 1 in Community Three', 'Group 1', 'group1.jpg', 'Community Three'),
('Description of Group 2 in Community Three', 'Group 2', 'group2.jpg', 'Community Three'),
('Description of Group 3 in Community Three', 'Group 3', 'group3.jpg', 'Community Three');

-- Insert registers_to records for users joining groups
INSERT INTO registers_to (user_id, group_id) VALUES
(1, 1), (1, 2), (1, 3),
(1, 4), (1, 5), (1, 6),
(1, 7), (1, 8), (1, 9),
(2, 1), (2, 2), (2, 3),
(2, 4), (2, 5), (2, 6),
(2, 7), (2, 8), (2, 9),
(3, 1), (3, 2), (3, 3),
(3, 4), (3, 5), (3, 6),
(3, 7), (3, 8), (3, 9);

-- Insert dummy contests for each group
INSERT INTO Contests (description, type, difficulty, name, start_date, end_date, status, group_id) VALUES
('Description of Contest 1 in Group 1 of Community One', 'team', 'Medium', 'Contest 1', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 1),
('Description of Contest 2 in Group 2 of Community One', 'team', 'Medium', 'Contest 2', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 2),
('Description of Contest 3 in Group 3 of Community One', 'team', 'Medium', 'Contest 3', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 3),
('Description of Contest 1 in Group 1 of Community Two', 'team', 'Medium', 'Contest 1', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 4),
('Description of Contest 2 in Group 2 of Community Two', 'team', 'Medium', 'Contest 2', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 5),
('Description of Contest 3 in Group 3 of Community Two', 'team', 'Medium', 'Contest 3', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 6),
('Description of Contest 1 in Group 1 of Community Three', 'team', 'Medium', 'Contest 1', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 7),
('Description of Contest 2 in Group 2 of Community Three', 'team', 'Medium', 'Contest 2', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 8),
('Description of Contest 3 in Group 3 of Community Three', 'team', 'Medium', 'Contest 3', '2023-10-01T00:00:00Z', '2023-10-31T23:59:59Z', 'finished', 9);`
  await client.query(query);
  console.log("testing Vals created successfully!");
};
setupDatabase();