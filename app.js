const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public")); // render the static pages like css
app.use(bodyParser.urlencoded({ extended: true })); // getting info of users from FN
app.set("view engine", "ejs"); // EJS requires 

// array of the items (Tasks of the TodoList)
// const items = ["Buy food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connection
    .once("open", () => console.log("Connected with a database"))
    .on("error", error => {
        console.log("Your Error", error);
    });
// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
// DB Schema

const itemsSchema = mongoose.Schema({
  name: String
});
// collection
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to the ToDoList app"
});

const item2 = new Item({
  name: "Hit the + button to add new task"
});

const item3 = new Item({
  name: "<-- Hit this Button to Delete your task"
});

const defultTasks = [item1, item2, item3]

// Item.insertMany(defultTasks)
//   .then(() => {
//     console.log("default data inserted");
//   })
//   .catch((err) => {
//     console.log(err);
//   })


// Home route
app.get("/", function (req, res) {




  res.render("list", { ListTitle: "Today", newListItems: items }); //passing data And render EJS 
});

app.post("/", function (req, res) {
  const item = req.body.userIn;

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");

  } else {
    items.push(item);
    res.redirect("/");
  }
});

// work route
app.get("/work", function (req, res) {
  res.render("list", { ListTitle: "Work List", newListItems: workItems });
});


//listing to the port
app.listen(3000, function () {
  console.log("Server is Up...");
});
