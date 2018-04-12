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
var itemsQuery = "SELECT * FROM products";
var itemList = []
var addStock = ''
var newStock = ''
var prodName = ''
var deptName = ''
var prodPrice = 0.00
var prodStock = 0

var q = [
    {
        type: "list",
        name: "select",
        message: "What would you like to do today Mr. Manager?",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
]
var q2 = [
    {
        type: "list",
        name: "selectItem",
        message: "Select the item to add stock:",
        choices: itemList
    },
    {
        type: "input",
        name: "addStock",
        message: "Enter the quantity of stock you would like to add to inventory for this item:",
        default: function () {
            return 1
        }
    }
]

var q3 = [
    {
        type: "input",
        name: "productName",
        message: "What is the name of the Product you would like to add?",
        default: function () {
            return "Name"
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "What is the name of the Department for the product you would like to add?",
        default: function () {
            return "Department"
        }
    },
    {
        type: "input",
        name: "price",
        message: "What is the Price of the product you would like to add?",
        default: function () {
            return "Price"
        }
    },
    {
        type: "input",
        name: "stock",
        message: "How much stock would you like to add for the Product?",
        default: function () {
            return 1
        }
    }
]


config.connect(function (e) {
    if (e) throw e;
});


function viewProducts() {
    config.query(itemsQuery, function (error, response) {
        if (error) throw error;
        for (i = 0; i < response.length; i++) {
            var temp = response[i].item_id + '. ' + response[i].product_name + ', $' + response[i].price + ', ' + response[i].stock_quantity
            console.log(temp)
        }
    })
}
function viewLow() {
    var lowQuery = "SELECT * FROM products WHERE stock_quantity < 5";
    config.query(lowQuery, function (error, response) {
        if (error) throw error;
        for (i = 0; i < response.length; i++) {
            var temp = response[i].item_id + '. ' + response[i].product_name + ', $' + response[i].price + ', ' + response[i].stock_quantity
            console.log(temp)
        }
    })
}
function addInventory() {
    config.query(itemsQuery, function (error, response) {
        if (error) throw error;
        for (i = 0; i < response.length; i++) {
            var temp = response[i].item_id + '. ' + response[i].product_name + ', Current Stock: ' + response[i].stock_quantity
            itemList.push(temp)
        }
        pmpt(q2).then(function (r) {
            var selection = r.selectItem.substring(0, r.selectItem.indexOf('.'))
            var stock = r.selectItem.substring(r.selectItem.length, r.selectItem.indexOf(':') + 2)
            // console.log(stock)
            var addedStock = r.addStock
            var newStock = parseInt(addedStock) + parseInt(stock)
            // console.log(newStock)
            var addStockQuery = "UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + selection
            config.query(addStockQuery, function (error, response) {
                if (error) throw error;
                console.log(addedStock + " item added to inventory!")
            })
        })
    })
}

function addProduct() {

    pmpt(q3).then(function (r) {
        var prodName = r.productName
        var deptName = r.deptName
        var prodPrice = r.price
        var prodStock = parseInt(r.stock)
        var addProdQuery = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + prodName + "', '" + deptName + "', " + prodPrice + ", " + prodStock + ")"
        var addedQuery = "SELECT * FROM products WHERE item_id = (SELECT MAX(item_id) FROM products)"
        config.query(addProdQuery, function (error, response) {
            config.query(addedQuery, function (error, response) {
                var row = response[0] 
                for (var key in row) {
                    console.log(key + ": " + row[key])
                }
            })
            console.log("Your product has been added!")
        })
    })

}

pmpt(q).then(function (r) {
    if (r.select === 'View Products for Sale') {
        viewProducts()
    } else if (r.select === 'View Low Inventory') {
        viewLow()
    } else if (r.select === 'Add to Inventory') {
        addInventory()
    } else if (r.select === 'Add New Product') {
        addProduct()
    }
})

