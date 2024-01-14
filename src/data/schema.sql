CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(20),
    age INT,
    hobbies JSON,
    UNIQUE KEY(username)
)

