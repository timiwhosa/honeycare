var express = require("express");
var path = require("path");
var app = express();
var Port = process.env.PORT || 3001;
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var multer = require("multer");
var moment = require("moment");
var fetch = require("node-fetch");
var fs = require("fs");
var bcrypt = require("bcrypt");
require("dotenv/config");
var session = require("express-session");

var router = require("./utils/routes/routes");
var conn = mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected");
  }
);

var public = path.join(__dirname, "./public");
app.use(express.static(public));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var salt = parseInt(process.env.Salt);
app.use(
  session({
    secret: "randomise it all",
    resave: true,
    saveUninitialized: false,
  })
);

const order = require("./models/order");
const user = require("./models/user");

function auth(req, res, next) {
  user.find({}).then(async (data) => {
    if (data) {
      if (req.session.userId === data[0]._id.toString()) {
        next();
      } else {
        res.redirect("/");
      }
    }
  });
}

router(app, public, path, moment, auth);


app.get("/login", (req, res) => {
  res.sendFile(public + "/html/login.html");
});
app.post("/login", async (req, res) => {
  user.find({ name: req.body.username }).then(async (data) => {
    if (data.length===1) {
      var pasw = await bcrypt.compare(req.body.password, data[0].password);
      if (pasw === true) {
        req.session.userId = data[0]._id;
        res.status(200).json({ redirect: "/adams#request", status: 200 });
      } else {
        res.json({ message: "error", status: 208 });
      }
    } else {
      res.json({ message: "error", status: 208 });
    }
  });
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return console.log(err);
      } else {
        res.json({ redirect: "/login", status:200 });
      }
    });
  }
});

app.post("/passwordchange",auth,  (req, res) => {

  console.log(req.body);

  user.find({ name: req.body.username }).then(async (data) => {
     if (data.length===1) {
       var pasw = await bcrypt.compare(req.body.password, data[0].password);
       if (pasw === true) {
         req.session.userId = data[0]._id;
         var newpassword = await bcrypt.hash(req.body.newpassword,salt);
         data[0].password = newpassword;
         data[0].name = req.body.newusername;
         data[0].save().then(() => {
          res.status(200).json({ message: "password/username updated", status: 200 });           
         })
       } else {
         res.json({ message: "error", status: 208 });
       }
     } else {
       res.json({ message: "error", status: 208 });
     }
   });
});

var char = new order({
  customerDetails: {
    name: "hello",
    number: 9090993,
    total: 50000,
    address: "lorem ipsum",
    time: moment(Date.now()).format("h:mma"),
    date: moment(Date.now()).format("DD/MM/YYYY"),
    paid: true,
    status: "recent",
  },
  products: [
    {
      id: "90983773",
      section: "health",
      subsection: "vitamins",
      name: "vitamins c",
      price: 5000,
      incart: 5,
    },
  ],
});
// char.save();
// var obj = new mongodb.ObjectId("61166494c47c5a21900e8116")

// order.find({}).then((r) => {
//   console.log(r)
//   r[0].products.push({
//     id: "909853773",
//     section: "health",
//     subsection: "vitamins",
//     incart: 5,
//   });
// r[0].save();

// })

app.listen(Port, () => {
  console.log("app started");
});
