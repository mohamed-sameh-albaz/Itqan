CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    bio TEXT,
    points INT DEFAULT 0,
    photo VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Community (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Rewards (
    id SERIAL PRIMARY KEY,
    description TEXT,
    type VARCHAR(50),
    name VARCHAR(255),
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Levels (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50),
    pointsThreshold INT UNIQUE,
    reward_id INT,
    FOREIGN KEY (reward_id) REFERENCES Rewards (id) 
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Groups (
    id SERIAL PRIMARY KEY,
    description TEXT,
    title VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    community_name VARCHAR(255),
    level_id INT DEFAULT(1),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_name) REFERENCES Community(name)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (level_id) REFERENCES Levels (id) 
        ON DELETE SET NULL

);

CREATE TABLE IF NOT EXISTS Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    community_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_name) REFERENCES Community(name)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Contests (
    id SERIAL PRIMARY KEY,
    description TEXT,
    type VARCHAR(255),
    difficulty VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status VARCHAR(255),
    group_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Tasks (
    id SERIAL PRIMARY KEY,
    contest_id INT,
    description TEXT,
    title VARCHAR(255),
    points INT,
    type VARCHAR(25),
    image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contest_id) REFERENCES Contests(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS McqTasks (
    id INT,
    A TEXT,
    B TEXT,
    C TEXT,
    D TEXT,
    right_answer CHAR(1),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES Tasks(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS History (
    id SERIAL PRIMARY KEY,
    contest_id INT,
    team_id INT,
    user_id INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contest_id) REFERENCES Contests(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_team (
    user_id INT,
    team_id INT,
    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS joinAs (
    user_id INT,
    role_id INT,
    community_name VARCHAR(255),
    approved BOOLEAN,
    PRIMARY KEY (user_id, community_name),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (community_name) REFERENCES Community(name)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS registers_to (
    user_id INT,
    group_id INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES Groups(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Submissions (
    id SERIAL PRIMARY KEY,
    score INT,
    status VARCHAR(50),
    content TEXT,
    task_id INT NOT NULL,
    approved_by INT, 
    approved_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id)
        ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES Users(id)
        ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS SingleSubmissions (
    submission_id INT NOT NULL,
    individual_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (submission_id, individual_id),
    FOREIGN KEY (submission_id) REFERENCES Submissions(id)
        ON DELETE CASCADE,
    FOREIGN KEY (individual_id) REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TeamSubmissions (
    submission_id INT NOT NULL,
    team_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (submission_id, team_id),
    FOREIGN KEY (submission_id) REFERENCES Submissions(id)
        ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    user_id INT NOT NULL, 
    comm_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)  
        ON DELETE CASCADE,
    FOREIGN KEY (comm_id) REFERENCES Community(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PostContent (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL, 
    content_type VARCHAR(50),
    content TEXT,
    FOREIGN KEY (post_id) REFERENCES Posts(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PostLikes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, --may be removed if not updated in UI
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PostComments (
    comment_id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL, 
    post_id INT NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- can be deleted
    FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_rewards (
    user_id INT NOT NULL, 
    reward_id INT NOT NULL, 
    awarded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, reward_id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE, 
    FOREIGN KEY (reward_id) REFERENCES Rewards (id)
        ON DELETE CASCADE
);