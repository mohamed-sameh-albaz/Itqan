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
  const query = `
    -- Insert dummy users
    INSERT INTO Users (email, password, fname, lname, bio, points, photo) VALUES
    ('user1@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'One', 'Bio of User One', 100, 'photo1.jpg'),
    ('user2@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Two', 'Bio of User Two', 200, 'photo2.jpg'),
    ('user3@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Three', 'Bio of User Three', 300, 'photo3.jpg'),
    ('user4@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Four', 'Bio of User Four', 400, 'photo4.jpg'),
    ('user5@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Five', 'Bio of User Five', 500, 'photo5.jpg'),
    ('user6@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Six', 'Bio of User Six', 600, 'photo6.jpg'),
    ('user7@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Seven', 'Bio of User Seven', 700, 'photo7.jpg'),
    ('user8@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Eight', 'Bio of User Eight', 800, 'photo8.jpg'),
    ('user9@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Nine', 'Bio of User Nine', 900, 'photo9.jpg'),
    ('user10@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Ten', 'Bio of User Ten', 1000, 'photo10.jpg'),
    ('user11@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Eleven', 'Bio of User Eleven', 1100, 'photo11.jpg'),
    ('user12@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Twelve', 'Bio of User Twelve', 1200, 'photo12.jpg'),
    ('user13@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Thirteen', 'Bio of User Thirteen', 1300, 'photo13.jpg'),
    ('user14@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Fourteen', 'Bio of User Fourteen', 1400, 'photo14.jpg'),
    ('user15@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Fifteen', 'Bio of User Fifteen', 1500, 'photo15.jpg'),
    ('user16@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Sixteen', 'Bio of User Sixteen', 1600, 'photo16.jpg'),
    ('user17@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Seventeen', 'Bio of User Seventeen', 1700, 'photo17.jpg'),
    ('user18@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Eighteen', 'Bio of User Eighteen', 1800, 'photo18.jpg'),
    ('user19@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Nineteen', 'Bio of User Nineteen', 1900, 'photo19.jpg'),
    ('user20@example.com', '$2b$10$8CH9VMZAzOJVJAKHrPTAD.QFkOC3WL3RXRn/C6umyWlhXThL6XC8u', 'User', 'Twenty', 'Bio of User Twenty', 2000, 'photo20.jpg');

    -- Insert dummy communities
    INSERT INTO Community (name, color, description) VALUES
    ('Community One', '#FF5733', 'Description of Community One'),
    ('Community Two', '#33FF57', 'Description of Community Two'),
    ('Community Three', '#3357FF', 'Description of Community Three'),
    ('Community Four', '#FF5734', 'Description of Community Four'),
    ('Community Five', '#33FF58', 'Description of Community Five'),
    ('Community Six', '#3357F0', 'Description of Community Six'),
    ('Community Seven', '#FF5735', 'Description of Community Seven'),
    ('Community Eight', '#33FF59', 'Description of Community Eight'),
    ('Community Nine', '#3357F1', 'Description of Community Nine'),
    ('Community Ten', '#FF5736', 'Description of Community Ten'),
    ('Community Eleven', '#33FF60', 'Description of Community Eleven'),
    ('Community Twelve', '#3357F2', 'Description of Community Twelve'),
    ('Community Thirteen', '#FF5737', 'Description of Community Thirteen'),
    ('Community Fourteen', '#33FF61', 'Description of Community Fourteen'),
    ('Community Fifteen', '#3357F3', 'Description of Community Fifteen'),
    ('Community Sixteen', '#FF5738', 'Description of Community Sixteen'),
    ('Community Seventeen', '#33FF62', 'Description of Community Seventeen'),
    ('Community Eighteen', '#3357F4', 'Description of Community Eighteen'),
    ('Community Nineteen', '#FF5739', 'Description of Community Nineteen'),
    ('Community Twenty', '#33FF63', 'Description of Community Twenty');

    -- Insert roles
    INSERT INTO Roles (name, description, color) VALUES
    ('admin', 'Administrator with full access', '#FF0000'),
    ('leader', 'Moderator with limited admin privileges', '#FFA500'),
    ('member', 'Regular member of the community', '#0000FF');

    -- Insert joinAs records
    DO $$
    DECLARE
        user_id INT;
        role_id INT;
        community_name VARCHAR(255);
    BEGIN
        FOR user_id IN 1..20 LOOP
            FOR role_id IN 1..3 LOOP
                FOR community_name IN ('Community One', 'Community Two', 'Community Three') LOOP
                    INSERT INTO joinAs (user_id, role_id, community_name, approved)
                    VALUES (user_id, role_id, community_name, true);
                END LOOP;
            END LOOP;
        END LOOP;
    END $$;

    -- Insert dummy groups for each community
    DO $$
    DECLARE
        community_id INT;
        group_id INT := 1;
    BEGIN
        FOR community_id IN 1..20 LOOP
            FOR i IN 1..3 LOOP
                INSERT INTO Groups (description, title, photo, community_name)
                VALUES (format('Description of Group %s in Community %s', i, community_id), format('Group %s', i), format('group%s.jpg', i), format('Community %s', community_id));
                group_id := group_id + 1;
            END LOOP;
        END LOOP;
    END $$;

    -- Insert registers_to records for users joining groups
    DO $$
    DECLARE
        user_id INT;
        group_id INT;
    BEGIN
        FOR user_id IN 1..20 LOOP
            FOR group_id IN 1..60 LOOP
                INSERT INTO registers_to (user_id, group_id)
                VALUES (user_id, group_id);
            END LOOP;
        END LOOP;
    END $$;

    -- Insert dummy contests for each group
    DO $$
    DECLARE
        group_id INT;
    BEGIN
        FOR group_id IN 1..60 LOOP
            INSERT INTO Contests (description, type, difficulty, name, start_date, end_date, status, group_id)
            VALUES (
                format('Description of Contest in Group %s', group_id),
                'team',
                'Medium',
                format('Contest %s', group_id),
                '2023-10-01T00:00:00Z',
                '2023-10-31T23:59:59Z',
                'finished',
                group_id
            );
        END LOOP;
    END $$;

    -- Insert 20 valuable rewards with realistic names, types, and descriptions
    INSERT INTO Rewards (name, type, description) 
    VALUES 
    ('Genius', 'Badge', 'Awarded for exceptional intelligence'),
    ('Top Student', 'Badge', 'Awarded for outstanding academic performance'),
    ('Master Coder', 'Badge', 'Awarded for excellence in coding'),
    ('Quiz Champion', 'Badge', 'Awarded for winning quizzes'),
    ('Speed Runner', 'Badge', 'Awarded for completing tasks quickly'),
    ('Problem Solver', 'Badge', 'Awarded for solving complex problems'),
    ('Math Whiz', 'Badge', 'Awarded for excellence in mathematics'),
    ('Science Star', 'Badge', 'Awarded for excellence in science'),
    ('History Buff', 'Badge', 'Awarded for knowledge in history'),
    ('Literature Lover', 'Badge', 'Awarded for love of literature'),
    ('Genius', 'Avatar', 'Avatar representing exceptional intelligence'),
    ('Top Student', 'Avatar', 'Avatar representing outstanding academic performance'),
    ('Master Coder', 'Avatar', 'Avatar representing excellence in coding'),
    ('Quiz Champion', 'Avatar', 'Avatar representing quiz champion'),
    ('Speed Runner', 'Avatar', 'Avatar representing speed in task completion'),
    ('Problem Solver', 'Avatar', 'Avatar representing problem-solving skills'),
    ('Math Whiz', 'Avatar', 'Avatar representing excellence in mathematics'),
    ('Science Star', 'Avatar', 'Avatar representing excellence in science'),
    ('History Buff', 'Avatar', 'Avatar representing knowledge in history'),
    ('Literature Lover', 'Avatar', 'Avatar representing love of literature');

    -- Insert 50 levels with names "level 1", "level 2", ..., and assign rewards randomly
    DO $$
    DECLARE
        i INT;
        reward_id INT;
    BEGIN
        FOR i IN 1..50 LOOP
            -- Randomly assign a reward_id or set it to NULL
            reward_id := (SELECT id FROM Rewards ORDER BY RANDOM() LIMIT 1);
            IF RANDOM() < 0.3 THEN
                reward_id := NULL;
            END IF;

            INSERT INTO Levels (name, reward_id, pointsThreshold) 
            VALUES (format('level %s', i), reward_id, i * 100);
        END LOOP;
    END $$;

    -- Insert dummy data into Posts table
    INSERT INTO Posts (title, user_id, comm_id, text_content)
    VALUES 
    ('Post Title 1', 1, 1, 'This is the content of post 1.'),
    ('Post Title 2', 2, 2, 'This is the content of post 2.'),
    ('Post Title 3', 3, 3, 'This is the content of post 3.'),
    ('Post Title 4', 4, 4, 'This is the content of post 4.'),
    ('Post Title 5', 5, 5, 'This is the content of post 5.'),
    ('Post Title 6', 6, 6, 'This is the content of post 6.'),
    ('Post Title 7', 7, 7, 'This is the content of post 7.'),
    ('Post Title 8', 8, 8, 'This is the content of post 8.'),
    ('Post Title 9', 9, 9, 'This is the content of post 9.'),
    ('Post Title 10', 10, 10, 'This is the content of post 10.'),
    ('Post Title 11', 11, 11, 'This is the content of post 11.'),
    ('Post Title 12', 12, 12, 'This is the content of post 12.'),
    ('Post Title 13', 13, 13, 'This is the content of post 13.'),
    ('Post Title 14', 14, 14, 'This is the content of post 14.'),
    ('Post Title 15', 15, 15, 'This is the content of post 15.'),
    ('Post Title 16', 16, 16, 'This is the content of post 16.'),
    ('Post Title 17', 17, 17, 'This is the content of post 17.'),
    ('Post Title 18', 18, 18, 'This is the content of post 18.'),
    ('Post Title 19', 19, 19, 'This is the content of post 19.'),
    ('Post Title 20', 20, 20, 'This is the content of post 20.');

    -- Insert dummy data into PostContent table
    INSERT INTO PostContent (post_id, content)
    VALUES 
    (1, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (2, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (3, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (4, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (5, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (6, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (7, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (8, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (9, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (10, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (11, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (12, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (13, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (14, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (15, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (16, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (17, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (18, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (19, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg'),
    (20, 'https://shabiba.eu-central-1.linodeobjects.com/2019/02/10/1001489.jpg');

    -- Insert dummy data into PostComments table
    DO $$
    DECLARE
        post_id INT;
        comment_id INT;
    BEGIN
        FOR post_id IN 1..20 LOOP
            FOR comment_id IN 1..10 LOOP
                INSERT INTO PostComments (user_id, post_id, created_at, updated_at, content)
                VALUES (
                    (SELECT id FROM Users ORDER BY RANDOM() LIMIT 1), -- Random user_id
                    post_id,
                    NOW() - (comment_id * INTERVAL '1 day'),
                    NOW() - (comment_id * INTERVAL '1 day'),
                    'Comment content'
                );
            END LOOP;
        END LOOP;
    END $$;

    -- Insert dummy data into User_rewards table
    DO $$
    DECLARE
        user_id INT;
        reward_id INT;
    BEGIN
        FOR user_id IN 1..20 LOOP
            FOR reward_id IN 1..20 LOOP
                INSERT INTO User_rewards (user_id, reward_id, awarded_at)
                VALUES (user_id, reward_id, NOW() - (reward_id * INTERVAL '1 day'));
            END LOOP;
        END LOOP;
    END
  END $$;
  `;
  await client.query(query);
  console.log("testing Vals created successfully!");
};
setupDatabase();