var express = require("express");
var path = require("path");
var app = express();
var Port = process.env.PORT || 3001;

var public = path.join(__dirname, "./public");

app.use(express.static(public));

app.get("/", (req, res) => {
  res.sendFile(public + "/index.html");
});
app.get("/2", (req, res) => {
  res.sendFile(public + "/index--copy.html");
});
app.get("/product/:health/:category/singleproduct/:productName", (req, res) => {
  res.sendFile(public + "/html/singleproduct.html");
});
app.get("/subcategory/:category", (req, res) => {
  // res.sendFile(public + "/html/subcategory.html");
});
app.get("/category/:category", (req, res) => {
  res.sendFile(public + "/html/subcategory.html");
});
app.get("/beauty", (req, res) => {
  res.sendFile(public + "/html/beauty/beauty.html");
});
app.get("/cart", (req, res) => {
  res.sendFile(public + "/html/cart.html");
});
app.get("/test", (req, res) => {
  res.sendFile(public + "/html/test.html");
});
app.get("/new", (req, res) => {
  res.sendFile(public + "/html/new-singleproduct.html");
});
app.get("/refill", (req, res) => {
  res.sendFile(public + "/html/refill.html");
});



app.listen(Port, () => {
  console.log("app started");
});
