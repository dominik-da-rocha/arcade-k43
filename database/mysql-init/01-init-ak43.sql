CREATE USER 'ak43_user' IDENTIFIED BY '1234';
CREATE DATABASE IF NOT EXISTS ak43_db;
GRANT ALL PRIVILEGES ON 'ak43_db.*' TO 'ak43_user';
