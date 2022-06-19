const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

//import("inquirer");

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  init();
});

const init = () => {
  inquirer.prompt([
    {
      name: "appPrompt",
      type: "list",
      message: "Welcome to the SQL employee tracker, please choose an option: ",
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit program']
    }
  ])

    .then(response => {
      switch (response.appPrompt) {
        case 'view all departments':
          viewDepartments();
          break;
        case 'view all roles':
          viewRoles();
          break;
        case 'view all employees':
          viewEmployees();
          break;
        case 'add a department':
          addDepartment();
          break;
        case 'add a role':
          addRole();
          break;
        case 'add an employee':
          addEmployee();
          break;
        case 'update an employee role':
          updateRole();
          break;
        case 'quit program':
          console.log("thank you for using the SQL employee tracker!");
          db.end();
          return;
        default:
          break;

      }
    })


}

const viewDepartments = () => {
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
};

const viewRoles = () => {
  db.query(`SELECT * FROM role`, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
};

const viewEmployees = () => {
  db.query(`SELECT * FROM employee`, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: "deparmentPrompt",
      type: "input",
      message: "Please enter the name of the department you wish to add to the database:",
    }
  ]).then((responseDepartment) => {

    db.query(`INSERT INTO department SET ?`, responseDepartment,
      (err, res) => {
        if (err) throw err;
        init();
      })
  })
};

const addRole = () => {

};

const addEmployee = () => {

};

const updateRole = () => {

};