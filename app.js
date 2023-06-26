const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+ "/date.js");
const app = express();

// array of the items (Tasks of the TodoList)
const items = ["Buy food", "Cook Food", "Eat Food"];
const workItems = [];

app.use(express.static("public")); // render the static pages like css
app.use(bodyParser.urlencoded({ extended: true })); // getting info of users from FN
app.set("view engine", "ejs"); // EJS requires 


// Home route
app.get("/", function (req, res) {

  const day = date.getDate(); //today's date
  res.render("list", { ListTitle: day, newListItems: items }); //passing data And render EJS 
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
