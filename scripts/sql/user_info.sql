CREATE TABLE IF NOT EXISTS Login_Users (
    idx INTEGER,
    discriminator TEXT,
    confidence TEXT,
    PRIMARY KEY (idx)
);
CREATE TABLE IF NOT EXISTS Login_Sessions (
    idx INTEGER,
    discriminator TEXT,
    session TEXT NOT NULL,
    PRIMARY KEY (idx)
);

INSERT INTO Login_Users (discriminator,confidence) VALUES ("_", "_")
