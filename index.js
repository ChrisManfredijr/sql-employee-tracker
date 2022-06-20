const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');




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
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Please enter the name of the new department',
      }
    ])
    .then((answer) => {
      let depQuery = `INSERT INTO department (department_name) VALUES (?)`;
      db.query(depQuery, answer.newDepartment, (err, res) => {
        if (err) throw err;
        console.log(answer.newDepartment + " has been added to departments");
        init();
      });
    });
};


const addRole = () => {
  let depQuery = `SELECT * FROM department`
  var depArray = [];
  var depIds = [];
  db.query(depQuery, (err, res) => {
    if (err) throw err;

    res.forEach((department) => {
      depArray.push(department.department_name);
      depIds.push(department.department_id);
    });
  })

  inquirer
    .prompt([
      {
        name: 'newRole',
        type: 'input',
        message: 'Please enter the title of your new role:'
      },
      {
        name: 'newRoleSalary',
        type: 'input',
        message: 'please enter the salary of your new role:'
      },
      {
        name: 'newRoleDep',
        type: 'list',
        message: 'Which department is this role in',
        choices: depArray
      }
    ])
    .then((answer) => {

      let rolePosition = depArray.indexOf(answer.newRoleDep, 0);
      let roleId = depIds[rolePosition];


      let roleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      let roleVals = [answer.newRole, answer.newRoleSalary, roleId];

      db.query(roleQuery, roleVals, (err, res) => {
        if (err) throw err;
        console.log(answer.newRole + " has been added to roles");
        init();
      });

    });

};

const addEmployee = () => {
  let roleQuery = `SELECT * FROM role`
  var roleArray = [];
  var roleIds = [];

  db.query(roleQuery, (err, res) => {
    if (err) throw err;

    res.forEach((role) => {
      roleArray.push(role.title);
      roleIds.push(role.department_id);
    });
  })

  let employeeQuery = `SELECT * FROM employee`
  var employeeArray = [];
  var employeeIds = [];

  db.query(employeeQuery, (err, res) => {
    if (err) throw err;

    res.forEach((employee) => {
      employeeArray.push(employee.first_name + " " + employee.last_name);
      employeeIds.push(employee.employeeIds);
    });
    employeeArray.push("none");
  })

  inquirer
    .prompt([
      {
        name: 'newFirst',
        type: 'input',
        message: 'Please enter the first name of the new employee: '
      },
      {
        name: 'newLast',
        type: 'input',
        message: 'please enter the last name of the new employee: '
      },
      {
        name: 'newRole',
        type: 'list',
        message: 'What is this employees role?',
        choices: roleArray
      },
      {
        name: 'newBoss',
        type: 'list',
        message: 'Who is this employees boss?',
        choices: employeeArray,
      }
    ])
    .then((answer) => {


      let rolePosition = roleArray.indexOf(answer.newRole, 0);
      let roleId = roleIds[rolePosition];

      var managerId;
      if (answer.newBoss !== "none") {
        let employeePosition = employeeArray.indexOf(answer.newBoss, 0);
        managerId = employeeIds[employeePosition];
      }

      let employeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      let employeeVals = [answer.newFirst, answer.newLast, roleId, managerId];

      db.query(employeeQuery, employeeVals, (err, res) => {
        if (err) throw err;
        console.log(answer.newFirst + " " + answer.newLast + " has been added to employees list");
      });
      init();
    });


};

const updateRole = () => {
  let employeeQuery = `SELECT * FROM employee`
  var employeeArray = [];
  var employeeIds = [];

  let roleQuery = `SELECT * FROM role`
  var roleArray = [];
  var roleIds = [];

  db.query(employeeQuery, (err, res) => {
    if (err) throw err;

    res.forEach((employee) => {
      employeeArray.push(employee.first_name + " " + employee.last_name);
      employeeIds.push(employee.employee_id);

    });

    db.query(roleQuery, (err, res) => {
      if (err) throw err;

      res.forEach((role) => {
        roleArray.push(role.title);
        roleIds.push(role.role_id);
      });
      startInquire();
    });


  })


  const startInquire = () => {
    inquirer
      .prompt([
        {
          name: 'updatedRole',
          type: 'list',
          message: 'What employees role do you wish to update?',
          choices: employeeArray
        },
        {
          name: 'newRole',
          type: 'list',
          message: 'What is their new role?',
          choices: roleArray,
        }
      ])
      .then((answer) => {
        let employeePosition = employeeArray.indexOf(answer.updatedRole, 0);
        let employeeId = employeeIds[employeePosition];

        let rolePosition = roleArray.indexOf(answer.newRole, 0);
        let roleId = roleIds[rolePosition];



        let employeeQuery = `UPDATE employee SET role_id = ? WHERE employee_id = ?`;
        let employeeVals = [roleId, employeeId];

        db.query(employeeQuery, employeeVals, (err, res) => {
          if (err) throw err;
          console.log(answer.updatedRole + "s role has been updated");
        });
        init();
      });
  };



};
