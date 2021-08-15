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
require("dotenv/config");

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

router(app, public, path, moment, conn);
const order = require("./models/order");

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
