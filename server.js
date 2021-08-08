var express = require("express");
var path = require("path");
var app = express();
var Port = process.env.PORT || 3001;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var fs = require("fs");
require("dotenv/config");

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected");
  }
);



var public = path.join(__dirname, "./public");
app.use(express.static(public));
var jsonparser = bodyParser.json();
var urlencodedparser = bodyParser.urlencoded({ extended: false });


// Get pages Request

app.get("/", (req, res) => {
  res.sendFile(public + "/index.html");
});
app.get(
  "/product/:section/:category/:subcategory/singleproduct/:productName",
  (req, res) => {
    res.sendFile(public + "/html/singleproduct.html");
  }
);
app.get("/category/:category", (req, res) => {
  res.sendFile(public + "/html/subcategory.html");
});
app.get("/cart", (req, res) => {
  res.sendFile(public + "/html/cart.html");
});
app.get("/refill", (req, res) => {
  res.sendFile(public + "/html/refill.html");
});
app.get("/favicon.ico", (req, res) => {
  res.send("hi");
});
app.get("/adams", (req, res) => {
  res.sendFile(public + "/admin/adams.html");
});

// social
app.get("/contact", (req, res) => {
  res.redirect("https://wa.me/+2348071360049");
});
app.get("/instagram", (req, res) => {
  res.redirect("https://instagram.com/honeycare_pnb");
});


// Fetch Request

app.get("/subcategory/:category", (req, res) => {
  
});
app.get("/popular", (req, res) => {
  res.send([
    {
      id: 1,
      name: "Fluvic Acid",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias, modi?",
      image: "/img/product/allproducts/product1.png",
      price: 10000,
      category: "health",
      subcategory: "Vitamins",
      section: "health",
    },
    {
      id: 2,
      name: "Fluvic Acid",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias, modi?",
      image: "/img/product/allproducts/product4.png",
      price: 10000,
      category: "health",
      subcategory: "Vitamins",
      section: "health",
      ingredient: "2tablets 2 times daily",
      uses: "lorem ipsum",
    },
    {
      id: 3,
      name: "Fluvic Acid",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias, modi?",
      image: "/img/product/allproducts/product1.png",
      price: 10000,
      category: "health",
      subcategory: "Vitamins",
      section: "health",
      ingredient: "2tablets 2 times daily",
      uses: "lorem ipsum",
    },
  ]);
})



// Post Request
app.post("/contact", jsonparser, (req, res) => {
  // customer message

  res.json({message: "We have received your message and would contact you shortly"})
});




// test

app.get("/2", (req, res) => {
  res.sendFile(public + "/New folder/index--copy.html");
});
app.get("/test", (req, res) => {
  res.sendFile(public + "/html/test.html");
});
app.get("/new", (req, res) => {
  res.sendFile(public + "/html/new-singleproduct.html");
});
app.get("/beauty", (req, res) => {
  res.sendFile(public + "/html/beauty/beauty.html");
});



app.listen(Port, () => {
  console.log("app started");
});
