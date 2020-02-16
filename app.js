// require, express, bodyParser, and date.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// create empty array items to be added to the "to do list"
// const items = [];
// const workItems = [];

// connect to mongoDB
mongoose.connect("mongodb+srv://admin-bernie:Q123456t@cluster0-8tphl.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// create mongoose schema
const itemsSchema = {
    name: String
};

// create db + specific scheme
const Item = mongoose.model("Item", itemsSchema);

// create 3 default items for DB
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "Hit the delete button to delete an item."
});

// insert 3 default items into an array
const defaultItems = [item1, item2, item3];


// create mongoose scheme
const listSchema = {
    name: String,
    items: [itemsSchema]
};

// create db + specific scheme
const List = mongoose.model("List", listSchema);

// use ejs for templating
app.set("view engine", "ejs");

// use bodyParser to grab html body elements
app.use(bodyParser.urlencoded({extended: true}));

// use public folder for our css files
app.use(express.static("public"));

// create home route
app.get("/", function(req, res){

// find items in our mongodb
    Item.find({}, function(err, foundItems) {

// check if database is empty, if so then insert and create the default DB, otherwise render the new item list
        if (foundItems.length === 0) {
// insert array into mongo db collection and show a error/success
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to database!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.get("/:customListName", function (req, res){
    const customListName = req.params.customListName;

// find if current custom list exists
    List.findOne({name: customListName}, function(err, foundList){
        if (!err) {
            if (!foundList) {
// create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
            });

                list.save();
                res.redirect("/" + customListName);
            } else {
// show existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });
});

// forwards the data entered in the form "newItem" back to the database
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function (err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});

// grabs checked item from the list.
app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

// check if i'm on the route "today" if so delete items, otherwise delete items from the custom route
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                console.log("Successfully deleted checked item.")
                res.redirect("/");
            }
            });
        } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if (!err){
                res.redirect("/" + listName);
            }
        })
    }
});

// create server on port heroku port or port 3000
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function() {
    console.log("Server has started sucessfully.");
});


