var express = require("express");
var path = require("path");
var app = express();
var Port = process.env.PORT || 3001;

var public = path.join(__dirname, "./public");

app.use(express.static(public));

app.get("/", (req, res) => {
  res.sendFile(public + "/index.html");
});
app.get("/category/:category", (req, res) => {
  res.sendFile(public + "/html/category.html");
});

app.listen(Port, () => {
  console.log("app started");
});
