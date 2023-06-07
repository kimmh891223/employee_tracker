DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
id INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30)
);

CREATE TABLE role (
  id INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department (id)
  
);

CREATE TABLE employee (
id INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT
);

SELECT
    e.id,
    e.first_name,
    e.last_name,
    (SELECT first_name FROM employee WHERE id = e.manager_id) AS manager_name,
    r.title,
    r.salary,
    d.name AS department_name
FROM
    employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id;
    
