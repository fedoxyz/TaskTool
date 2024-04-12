# Shell
`git clone https://github.com/fedoxyz/TaskTool.git`
`cd TaskTool/server && npm init` 
`sudo -u postgres psql` 

# SQL query to setup database 
```
CREATE DATABASE db_name;

CREATE USER db_username PASSWORD 'db_password';

GRANT CONNECT ON DATABASE db_name TO db_username;

GRANT ALL PRIVILEGES ON DATABASE db_name TO db_username;

\c db_name postgres

GRANT ALL ON SCHEMA public TO db_username;
```

# Start server
`node server`

