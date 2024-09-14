CREATE TABLE IF NOT EXISTS Auth_Data (
    idx INTEGER,
    org_name TEXT,
    pass_word TEXT,
    cloud_size INTEGER, -- MB
    PRIMARY KEY (idx)
);
CREATE TABLE IF NOT EXISTS Auth_Sessions (
    idx INTEGER,
    sessionid TEXT,
    corresponder TEXT, -- Account Name
    PRIMARY KEY (idx)
);

INSERT INTO Auth_Data (org_name, pass_word, cloud_size) VALUES ("_", "_", 0);
