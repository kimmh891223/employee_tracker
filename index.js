// requiring neccessary packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// making mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeeTracker_db'
})

function init () {

// initial question
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'order',
      choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    },
  ])

  // view all employee and info
  .then((answer) => {
    if (answer.order === 'View All Employees') {
        db.query(`SELECT
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
        JOIN department d ON r.department_id = d.id;`, function(err, results){
            if (err) {
                console.log(err);
                return;
            }
            console.table(results)
        });

    // view all roles    
    } else if (answer.order === 'View All Roles') {
        db.query('SELECT * FROM role', function(err, results){
            if (err) {
                console.log(err);
                return;
            }
            console.table(results)
        });

    // view all departments
    } else if (answer.order === 'View All Departments') {
        db.query('SELECT * FROM department', function(err, results){
            if (err) {
                console.log(err);
                return;
            }
            console.table(results)
        });

    // adding an employee and the information
    } else if (answer.order === 'Add Employee') {
        const query = `SELECT * FROM employee`
        db.query(query, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            const manager = results.map(row => ({ name: row.first_name, value: row.id }))
            const query2 = 'SELECT * FROM role'
            db.query(query2, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const roleChoices = results.map(row => ({ name: row.title, value: row.id }))
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the first name of the employee?',
                        name: 'first_name'
                    },
                    {
                        type: 'input',
                        message: 'What is the last name of the employee?',
                        name: 'last_name'
                    },
                    {
                        type: 'list',
                        message: 'What is the role of the employee?',
                        name: 'role_id',
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        message: 'Does he/she have a manager?',
                        name: 'manager',
                        choices: ['yes', 'no'],
                    },
                    {
                        type: 'list',
                        message: 'What is the name of the manager?',
                        name: 'manager_id',
                        choices: manager,
                        when: (employee) => employee.manager === 'yes'
                    },
                ])
                .then((employee) => {
                    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    const values = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id];
                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('New employee was added successfully!')
                    })
                })
                })
            }) 

        // adding new roles and the information
        } else if (answer.order === 'Add Role') {
        const query = `SELECT * FROM employeetracker_db.department;`
        db.query(query, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            const depChoices = results.map(row => ({ name: row.name, value: row.id }))

        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'role_name',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'role_salary',
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'role_department',
                choices: depChoices
                
            },
        ])
        .then((role) => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [role.role_name, role.role_salary, role.role_department];
            db.query(query, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('New role was added successfully!')
            })
        })
        })

        // adding new department
        } else if (answer.order === 'Add Department') {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'dep_name',
            },
        ])
        .then((department) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            const values = [department.dep_name];
            db.query(query, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('New department was added successfully!')
            })
        })

        // updating an employee role
        } else if (answer.order === 'Update Employee Role') {
        const query = `SELECT * FROM employee;`

        db.query(query, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            const update_target = results.map(row => ({ name: row.first_name, value: row.id }))

            const query2 = 'SELECT * FROM role'
            db.query(query2, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const update_role = results.map(row => ({ name: row.title, value: row.id }))

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which employee would you like to update?',
                        name: 'update_target',
                        choices: update_target
                    },
                    {
                        type: 'list',
                        message: 'Which position would you like to update to?',
                        name: 'update_role',
                        choices: update_role
                    },
                ])
                .then((update) => {
                    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                    const values = [update.update_role, update.update_target];
                    db.query(query, values, (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('Role was updated successfully!')
                    })
                })
            })
        })
    }
    
  });
};

init()