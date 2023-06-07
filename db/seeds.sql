INSERT INTO department (name)
VALUES ("Sales"),
       ("HR"),
       ("Accounting"),
       ("Marketing"),
       ("Legal"),
       ("Services");

INSERT INTO role (title, salary, department_id)
VALUES ("salesperson", 50000, 1),
       ("HR person", 80000, 2),
       ("accountant", 90000, 3),
       ("marketer", 120000, 4),
       ("lawyer", 250000, 5),
       ("sales lead", 100000, 1),
       ("customer service rep", 60000, 6);
       
       
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Amy", "Abraham", 1),
       ("Bill", "Bing", 2),
       ("Cathy", "Carson", 3),
       ("Daniel", "DeNiro", 4),
       ("Edith", "Ewing", 5),
       ("Flower", "Florence", 6),
       ("Gunther", "Gunner", 7);
       