const router = (app, public, path, moment) => {
  // Get pages Request
  var mongodb = require("mongodb");

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

  // social
  app.get("/contact", (req, res) => {
    res.redirect("https://wa.me/+2348071360049");
  });
  app.get("/instagram", (req, res) => {
    res.redirect("https://instagram.com/honeycare_pnb");
  });

  // *********************************

  // MODELS
  const order = require(path.join(__dirname, "../../models/order"));
  const refill = require(path.join(__dirname, "../../models/refill"));
  const Product = require(path.join(__dirname, "../../models/product"));
  const allcategories = require(path.join(__dirname, "../../models/category"));

  // console.log(order)
  // Fetch Request
  app.get("/subcategory/:category", (req, res) => {});
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
  });

  // Post Request
  app.post("/contact", (req, res) => {
    // customer message
    res.json({
      message: "We have received your message and would contact you shortly",
    });
  });

  app.post("/pay", (req, res) => {
    console.log(req.body);
    res.json({
      message: "We have received your message and would contact you shortly",
    });
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

  // Admin

  //   GET request
  var private = path.join(__dirname, "../../private");
  app.get("/adams", (req, res) => {
    res.sendFile(private + "/admin/adams.html");
  });
  app.get("/admin/style.css", (req, res) => {
    // clearance required
    res.sendFile(private + "/admin/style.css");
  });
  app.get("/admin/adams.js", (req, res) => {
    // clearance required
    res.sendFile(private + "/admin/adams.js");
  });
  app.get("/orders", async (req, res) => {
    var allorders = await order.find({
      "customerDetails.status": req.query.type,
    });
    var orders = await allorders.map((singleorder) => {
      var customerorder = {
        _id: singleorder._id,
        ...singleorder.customerDetails,
      };
      return customerorder;
    });
    res.json(orders);
  });
  app.get("/order", async (req, res) => {
    // single order
    var id = mongodb.ObjectId(req.query.id);
    var orderproduct = await order.find({ _id: id }).then((order) => {
      return order;
    });
    res.json(orderproduct);
  });
  app.get("/refills", async (req, res) => {
    // all refills by status
    refill
      .find({ status: req.query.type })
      .then((refills) => {
        res.json(refills);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  app.get("/allcategories", async (req, res) => {
    var allcategory = await allcategories.find({});
    // console.log(allcategory)
    res.json(allcategory)
  });

  var refil = new refill({
    name: "hi",
    number: "909090",
    date: "23/34/45",
    time: "12:22pm",
    image: "/loremipsum",
    status: "delivered",
  });
  // refil.save();

  // POST request

  app.post("/order-delivered", async (req, res) => {
    // order delivered
    var id = req.body.id;
    var id = mongodb.ObjectId(id);
    order
      .update({ _id: id }, { $set: { "customerDetails.status": "delivered" } })
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });
  app.post("/order-notdelivered", async (req, res) => {
    // order delivered
    var id = req.body.id;
    var id = mongodb.ObjectId(id);
    order
      .update({ _id: id }, { $set: { "customerDetails.status": "recent" } })
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });

  app.post("/refill-delivered", async (req, res) => {
    // order delivered
    var id = req.body.id;
    var id = mongodb.ObjectId(id);
    order
      .updateOne({ _id: id }, { $set: { "customerDetails.delivered": true } })
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });

  // console.log(allcategories.categories);

  function addcategorytoproduct(res,cat) {
    Product.findOne({ category: cat }).then((categoryexist) => {
      if (categoryexist) {
        res.json({ message: "category Exist", status: 208 });
      } else {
        var newcategory = new Product({
          category: cat.toLowerCase(),
          subcategories: { subcategorynames: [] },
        });
        newcategory
          .save()
          .then(() => {
            console.log("product added")
          })
          .catch((err) => console.error(err));
      }
    });
  }

  app.post("/addcategory", (req, res) => {
    var cat = req.body.category.toLowerCase();
    allcategories.find({}).then((det) => {
      if (det.length === 0) {
        var dat = new allcategories({ categories: [cat] });
        dat
          .save()
          .then(() => {
            addcategorytoproduct(res, cat);
          })
          .then(() => res.json({ message: "category added", status: 200 }));
      } else {
        allcategories.findOne({ categories: { $all: [cat] } }).then((data) => {
          
          if (data === null) {
            allcategories.find({}).then((categorydata) => {
              categorydata[0].categories.push(cat);
              categorydata[0]
                .save()
                .then(() => {
                  addcategorytoproduct(res, cat);
                })
                .then(() =>
                  res.json({ message: "category added", status: 200 })
                );              
            });
          } else {
            res.json({ message: "category exist", status: 208 });
          }
        });
      }
    });
  });

  var product = new Product({
    category: "health",
    subcategories: {
      vitamins: [
        {
          name: "fluvic acid",
          discription: "lorem ipsum",
          ingredients: "hihiihih hihii",
          uses: "ghghhfyf",
          image: "fnfnbfbf",
          price: 5000,
          _id: new mongodb.ObjectID(),
        },
      ],
      subcategorynames: ["vitamins"],
    },
  });
  // product.save();

  // Product.findOne({ category: "health" }).then((prod) => console.log(prod));
};

module.exports = router;
