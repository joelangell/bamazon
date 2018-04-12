var inq = require("inquirer");
var pmpt = inq.createPromptModule();
var mysql = require("mysql");
var config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon",
    port: 3308,
    sockePath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
var table = require('table')
var deptName = ''
var overHead = 0

var q = [
    {
        type: "list",
        name: "select",
        message: "What would you like to do today Supervisor Bezos?",
        choices: ['View Product Sales by Department', 'Create a New Department']
    }
]

var q2 = [
    {
        type: "input",
        name: "deptName",
        message: "What is the name of the Department you would like to add?",
        default: function () {
            return "Dept Name"
        }
    },
    {
        type: "input",
        name: "deptOverhead",
        message: "What is the name of the overhead for the Department you would like to add?",
        default: function () {
            return "Department"
        }
    }
]

function viewSales() {
    var viewSalesQuery =
        `Select d.department_id, d.department_name, d.over_head_costs, p.product_sales, (p.product_sales - d.over_head_costs) AS total_profit
    from departments d 
    inner join products p on d.department_name = p.department_name
    GROUP BY department_name
    ORDER BY d.department_id`
    config.query(viewSalesQuery, function (error, response) {
        for (i = 0; i < response.length; i++) {
            var row = response[i]
            for (var key in row) {
                console.log(key + ": " + row[key])
            }
        }
    })
    //     // import {
    //     //     table
    //     //   } from 'table';

    //       // Using commonjs?
    //       // const {table} = require('table');

    //       let data,
    //           output;

    //       data = [
    //           ['0A', '0B', '0C'],
    //           ['1A', '1B', '1C'],
    //           ['2A', '2B', '2C']
    //       ];

    //       /**
    //        * @typedef {string} table~cell
    //        */

    //       /**
    //        * @typedef {table~cell[]} table~row
    //        */

    //       /**
    //        * @typedef {Object} table~columns
    //        * @property {string} alignment Cell content alignment (enum: left, center, right) (default: left).
    //        * @property {number} width Column width (default: auto).
    //        * @property {number} truncate Number of characters are which the content will be truncated (default: Infinity).
    //        * @property {number} paddingLeft Cell content padding width left (default: 1).
    //        * @property {number} paddingRight Cell content padding width right (default: 1).
    //        */

    //       /**
    //        * @typedef {Object} table~border
    //        * @property {string} topBody
    //        * @property {string} topJoin
    //        * @property {string} topLeft
    //        * @property {string} topRight
    //        * @property {string} bottomBody
    //        * @property {string} bottomJoin
    //        * @property {string} bottomLeft
    //        * @property {string} bottomRight
    //        * @property {string} bodyLeft
    //        * @property {string} bodyRight
    //        * @property {string} bodyJoin
    //        * @property {string} joinBody
    //        * @property {string} joinLeft
    //        * @property {string} joinRight
    //        * @property {string} joinJoin
    //        */

    //       /**
    //        * Used to dynamically tell table whether to draw a line separating rows or not.
    //        * The default behavior is to always return true.
    //        *
    //        * @typedef {function} drawJoin
    //        * @param {number} index 
    //        * @param {number} size 
    //        * @return {boolean} 
    //        */

    //       /**
    //        * @typedef {Object} table~config
    //        * @property {table~border} border
    //        * @property {table~columns[]} columns Column specific configuration.
    //        * @property {table~columns} columnDefault Default values for all columns. Column specific settings overwrite the default values.
    //        * @property {table~drawJoin} drawHorizontalLine
    //        */

    //       /**
    //        * Generates a text table.
    //        *
    //        * @param {table~row[]} rows 
    //        * @param {table~config} config 
    //        * @return {String} 
    //        */
    //       output = table(data);

    //       console.log(output);
}

function createDept() {
    pmpt(q2).then(function (r) {
        var deptName = r.deptName
        var overHead = r.deptOverhead
        var addDeptQuery = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + deptName + "', " + overHead + ")"
        var addedDeptQuery = "SELECT * FROM departments WHERE department_id = (SELECT MAX(department_id) FROM departments)"
        config.query(addDeptQuery, function (error, response) {
            config.query(addedDeptQuery, function (error, response) {
                var row = response[0]
                for (var key in row) {
                    console.log(key + ": " + row[key])
                }
            })
            console.log("Department added!")
        })
    })
}


pmpt(q).then(function (r) {
    if (r.select === 'View Product Sales by Department') {
        viewSales()
    } else if (r.select === 'Create a New Department') {
        createDept()
    }
})

