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

CREATE TABLE IF NOT EXISTS Groups (
    id SERIAL PRIMARY KEY,
    description TEXT,
    title VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    comm_id INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comm_id) REFERENCES Community(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    group_id INT,
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
    image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contest_id) REFERENCES Contests(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
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
        ON DELETE SET NULL
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
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS administrates (
    user_id INT,
    community_id INT,
    PRIMARY KEY (user_id, community_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (community_id) REFERENCES Community(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS joinAs (
    user_id INT,
    role_id INT,
    community_id INT,
    approved BOOLEAN,
    PRIMARY KEY (user_id, role_id, community_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (community_id) REFERENCES Community(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);