const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public")); // render the static pages like css
app.use(bodyParser.urlencoded({ extended: true })); // getting info of users from FN
app.set("view engine", "ejs"); // EJS requires 


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

const listSchema = {
  name: String,
  items: [itemsSchema]
}

// collection
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to the ToDoList app"
});

const item2 = new Item({
  name: "Hit the + button to add new task"
});

const item3 = new Item({
  name: "<-- Hit this Button to Delete your task"
});

const defultTasks = [item1, item2, item3];

// Home route
app.get("/", function (req, res) {

  Item.find()
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defultTasks)
          .then(() => {
            console.log("default data inserted");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { ListTitle: "Today", newListItems: foundItems }); //passing data And render EJS 
      }
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.userIn;

  const item = new Item({
    name: itemName
  });
  item.save()
    .then(() => {
      console.log(itemName + " inserted..");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

// custom list of users
app.get("/:listName", function (req, res) {
  const customListName = (req.params.listName);
  // check if the list is allready avalible

  List.findOne({ name: customListName })
  // cheating a new list if not present 
    .then((foundlist) => {
      if (!foundlist) {
        const list = new List({
          name: customListName,
          items: defultTasks
        });

        // saving to the DB
        list.save(); 
        console.log("saved new List");
        res.redirect("/" + customListName);
      } else {
        // rendering the already created list 
        res.render("list", { ListTitle: foundlist.name, newListItems: foundlist.items });
      }
    })
    .catch((err) => {
      console.log(err);
    })


});

// delating the item from the Today list
app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;

  Item.findByIdAndRemove({ _id: checkedItem })
    .then(() => {
      console.log(checkedItem + " deleted");
      res.redirect("/")
    })
    .catch((err) => {
      console.log(err);
    });
});



//listing to the port
app.listen(3000, function () {
  console.log("Server is Up...");
});
