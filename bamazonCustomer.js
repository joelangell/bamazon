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
var bidItems = [];
var itemsQuery = "SELECT * FROM products";
var itemList = []
var quant = ''
var stock = ''
var price = ''
var paid = ''

config.connect(function (e) {
    if (e) throw e;
});

config.query(itemsQuery, function (error, response) {
    if (error) throw error;
    for (i = 0; i < response.length; i++) {
        var temp = response[i].item_id + '. ' + response[i].product_name + ', $' + response[i].price
        itemList.push(temp)
    }
    pmpt(qs).then(function (r) {
        var selection = r.select.substring(0, r.select.indexOf('.'))
        var quant = r.quantity
        var checkQuery = "SELECT * FROM products WHERE item_id = " + selection
        config.query(checkQuery, function (error, response) {
            if (error) throw error;
            var stock = response[0].stock_quantity
            var price = response[0].price
            var paid = price * quant
            var sold = response[0].product_sales
            var newSold = paid + sold
            if (quant > stock) {
                console.log("Insufficient quantity!")
            } 
            else {
                var newQuantity = stock - quant
                var buyQuery = "UPDATE products SET stock_quantity = " + newQuantity + ", product_sales = " + newSold + " WHERE item_id = " + selection
                config.query(buyQuery, function (error, response) {
                    console.log("Thank you for your order!")
                    console.log("Your total paid is $" + paid)
                })
            }
        })
    })
});

// function query(x) {
//     config.query(x, function (error, response) {
//         if (error) throw error;
//     })
// }

var qs = [
    {
        type: "list",
        name: "select",
        message: "Please select the item you would like to purchase:",
        choices: itemList
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?",
        default: function () {
            return 1
        }
    }
]





