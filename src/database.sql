CREATE DATABASE todoList;
USE todoList;

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deadline DATE NOT NULL
);

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deadline DATE NOT NULL
);

CREATE USER 'Durán'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON tasks_goals_db.* TO 'Durán'@'localhost';
FLUSH PRIVILEGES;
