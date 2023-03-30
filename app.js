const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Parser = require("body-parser");
const date = require(__dirname + "/date.js");
mongoose.set("strictQuery", true);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Server started on port 3000");
  console.log("Its work!!!!!!!!!");
});
let itemsOld = ["Buy Food", "Cook Food", "Eat Food"];
//you can change this from let to const becouse the push method doesn't effect the entirly array:
let workItems = [];

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
mongoose.connect(
  "mongodb+srv://husseinfarqad:Test2002@cluster0.b0x8l6g.mongodb.net/todolistDB"
);
mongoose.set("strictQuery", true);
app.set("view engine", "ejs");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
          console.log("This is an error!");
        } else {
          console.log("Successfuly saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      // let day = date.getDay();
      res.render("list", { listTitle: "Today", newListItems: foundItems });
      // res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

const collectionSchema = {
  name: String,
  list: Array,
};
const List = mongoose.model("List", collectionSchema);

app.get("/about", function (req, res) {
  res.render("about");
});

let response = "";
app.get("/else/Me", function (req, res) {
  res.render("clinic", { response });
});

app.post("/else/year", function (req, res) {
  console.log(req.body);
  const year = req.body.year;
  if (year % 4 === 0) {
    // res.redirect("/else/Me")
    res.render("clinic", { response: "leap", year });
  } else {
    res.render("clinic", { response: "Not leap", year });
  }
});

app.get("/:collection", function (req, res) {
  console.log("your req.params in collection: ", req.params);
  const collectionName = req.params.collection;
  console.log("collectionName is: ", collectionName);

  List.countDocuments(
    { name: collectionName },
    function (err, foundItemscount) {
      if (foundItemscount > 0) {
        // console.log("Item is already exist!", foundItemscount);
        List.findOne({ name: collectionName }, function (err, foundItem) {
          if (!err) {
            res.render("list", {
              listTitle: collectionName,
              newListItems: foundItem.list,
            });
          }
        });
      } else {
        const listDoc = new List({
          name: collectionName,
          // list: defaultItems,
        });
        listDoc.save();
        res.redirect("/" + collectionName);
      }
    }
  );
});

var itemList = [];
app.post("/", function (req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.list;
  console.log(req.body);

  const Item6 = new Item({
    name: newItem,
  });

  if (listName === "Today") {
    Item6.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.list.push(Item6);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

const workSchema = {
  name: String,
};

const Work = mongoose.model("Work", itemsSchema);

app.get("/work", function (req, res) {
  Work.find({}, function (err, workfoundItems) {
    if (err) {
      console.log(err);
      console.log("Work error!!");
    } else {
      res.render("list", {
        listTitle: "Work List",
        newListItems: workfoundItems,
      });
    }
  });
});

app.post("/work", function (req, res) {
  const itemName = req.body.newItem;
  const item5 = new Work({
    name: itemName,
  });
  console.log(itemName);
  item5.save();
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {
  // console.log(req.body);
  const itemCheckId = req.body.checkbox;
  const listName = req.body.namelist;
  const checkedItemID = new mongoose.mongo.ObjectId(req.body.checkbox);
  // console.log(checkedItemID);
  console.log("your req.body in delete is: ", req.body);
  if (listName === "Today") {
    Item.findByIdAndRemove(itemCheckId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Item has been deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { list: { _id: checkedItemID } } },
      function (err, foundList) {
        if (!err) {
          console.log("foundList in delete::", foundList);
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
});
