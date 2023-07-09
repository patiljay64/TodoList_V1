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
        console.log( itemName+" inserted..");
    })
    .catch((err) => {
        console.log(err);
    });
    res.redirect("/");
});

app.post("/delete", function(req,res){
  const checkedItem = req.body.checkbox;

  Item.findByIdAndRemove({_id: checkedItem})
    .then(()=>{
      console.log(checkedItem + " deleted");
      res.redirect("/")
    })
    .catch((err)=>{
      console.log(err);
    });
});

// work route
app.get("/work", function (req, res) {
  res.render("list", { ListTitle: "Work List", newListItems: workItems });
});


//listing to the port
app.listen(3000, function () {
  console.log("Server is Up...");
});
