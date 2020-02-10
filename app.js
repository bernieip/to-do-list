// require, express, bodyParser, and date.js
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// create empty array items to be added to the "to do list"
const items = [];
const workItems = [];

// use ejs for templating
app.set("view engine", "ejs");

// use bodyParser to grab html body elements
app.use(bodyParser.urlencoded({extended: true}));

// use public folder for our css files
app.use(express.static("public"));

// create home route
app.get("/", function(req, res){

// function to get the current date
    const day = date.getDate();

// posts the items to the "to do list" based on the input from the html form to the html
    res.render("list", {listTitle: day, newListItems: items});
});

// forwards the data entered in the form "newItem" back to the server
app.post("/", function (req, res) {
    const item = req.body.newItem;

// checks if the button was pressed on the home page or the work page, and forwards the item to the appropriate page
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

// create work route
app.get("/work", function(req, res) {

// posts the items to the "to do list" based on the input from the html form to the html
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

// forwards the data entered in the form "newItem" back to the server
app.post("/work", function (req,res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

// create server on port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
});


