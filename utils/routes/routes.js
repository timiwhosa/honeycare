const router = (app, public, path, moment, auth) => {
  // Get pages Request
  var mongodb = require("mongodb");
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, `./public/uploads/${req.query.section}/${req.query.school}`);
    },
    filename: function (req, res, cb) {
      // console.log(res, req.query)
      cb(
        null,
        res.originalname.replace(/\s/g, "-").split(".")[0] +
          "-jetbooks-" +
          req.query.name +
          "." +
          res.originalname.replace(/\s/g, "-").split(".")[1]
      );
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
  });

  app.get("/", (req, res) => {
    res.sendFile(public + "/index.html");
  });
  app.get(
    "/product/:category/:subcategory/singleproduct/:productID",
    (req, res) => {
      res.sendFile(public + "/html/singleproduct.html");
    }
  );

  // *********************************

  // MODELS
  const order = require(path.join(__dirname, "../../models/order"));
  const refill = require(path.join(__dirname, "../../models/refill"));
  const Product = require(path.join(__dirname, "../../models/product"));
  const allcategories = require(path.join(__dirname, "../../models/category"));


  // GET REQUEST CONTINUES

  app.get("/products/:category/:subcategory", (req, res) => {
    var cat = req.params.category;
    var subcat = req.params.subcategory;
    console.log(subcat)

    Product.find({ category: cat }).then(async (data) => {
      // console.log(data)
      if (data.length >= 1) {
        var productstosend=[];
        Object.entries(data).forEach((dat) => {
          // console.log(dat)
          if (dat[1].subcategory === subcat) {
            productstosend.push(dat[1]);
          }
        });
        if (productstosend.length>=1) {
          res.json({ productstosend, status: 200 });
        } else {
          res.json({ message: "product not found", status: 208 });
        }
      } else {
        res.json({ message: "product not found", status: 208 });
      }
    });
  });
  
  app.get("/singleproduct", (req, res) => {
    var cat = req.query.category;
    var subcat = req.query.subcategory;
    var id = req.query.id;

    Product.find({ category: cat }).then(async (data) => {
      if (data.length >= 1) {
        var producttosend;
        var otherproducttosend= [];
        var i = 1;
        Object.entries(data).forEach((dat) => {
          if (dat[1].subcategory === subcat) {
            if (String(dat[1]._id) === String(id)) {
              producttosend= dat[1];
            } else {
              if (i < 4) {
                otherproducttosend.push(dat[1]);
                i++;
              }
            }
          } 
        });
        if (producttosend) {
          res.json({ producttosend, otherproducttosend, status: 200 });
        } else {
          res.json({ message: "product not found", status: 208 });
        }
      } else {
        res.json({ message: "product not found", status: 208 });
      }
    });
  });

  app.get("/category", (req, res) => {
    // fetch from home page
    allcategories.find({}).then((data) => {
      if (data.length === 1) {
        res.json({ data, status: 200 });        
      }
    });
  });

  // app.get("/category/:category", (req, res) => {
  //   // fetch from home page
  //   var cattosend = req.params.category;
  //   allcategories.find({}).then((data) => {
  //     res.json(data);
  //   });
  // });
  app.get("/category/:category/:subcategory", (req, res) => {
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

  // Fetch Request
  app.get("/subcategory/:category", (req, res) => {});
  app.get("/popular", (req, res) => {
    res.send([
      {
        _id: 1,
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
        _id: 2,
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
        _id: 3,
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
  app.get("/adams", auth, (req, res) => {
    res.sendFile(private + "/admin/adams.html");
  });
  app.get("/admin/style.css", auth, (req, res) => {
    // clearance required
    res.sendFile(private + "/admin/style.css");
  });
  app.get("/admin/adams.js", auth, (req, res) => {
    // clearance required
    res.sendFile(private + "/admin/adams.js");
  });
  app.get("/orders", auth, async (req, res) => {
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
  app.get("/order", auth, async (req, res) => {
    // single order
    var id = mongodb.ObjectId(req.query.id);
    var orderproduct = await order.find({ _id: id }).then((order) => {
      return order;
    });
    res.json(orderproduct);
  });
  app.get("/refills", auth, async (req, res) => {
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
  app.get("/allcategories", auth, async (req, res) => {
    var allcategory = await allcategories.find({});
    // console.log(allcategory)
    res.json(allcategory);
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

  app.post("/order-delivered", auth, async (req, res) => {
    // order delivered
    var id = mongodb.ObjectId(req.body.id);
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
  app.post("/order-notdelivered", auth, async (req, res) => {
    // order not delivered
    var id = mongodb.ObjectId(req.body.id);
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

  app.post("/refill-delivered", auth, async (req, res) => {
    // order delivered
    var id = mongodb.ObjectId(req.body.id);
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

  // function addcategorytoproduct(cat) {
  //   Product.findOne({ category: cat }).then((categoryexist) => {
  //     if (categoryexist) {
  //       return;
  //     } else {
  //       var newcategory = new Product({
  //         category: cat.toLowerCase(),
  //         subcategories: { subcategorynames: [] },
  //       });
  //       newcategory
  //         .save()
  //         .then(() => {
  //           console.log("product added");
  //         })
  //         .catch((err) => console.error(err));
  //     }
  //   });
  // }
  // function editcategorytoproduct(cat, newcat) {
  //   Product.findOne({ category: cat }).then((categoryexist) => {
  //     if (categoryexist) {
  //       categoryexist.category = newcat;
  //       categoryexist
  //         .save()
  //         .then(() => {})
  //         .then(() => console.log("done"));
  //     } else {
  //       return;
  //     }
  //   });
  // }

  // function addsubcategorytoproduct(cat, subcat) {
  //   Product.findOne({ category: cat }).then((categoryexist) => {
  //     if (categoryexist) {
  //       categoryexist.subcategories[subcat] = [];
  //       categoryexist.markModified("subcategories");
  //       categoryexist
  //         .save()
  //         .then(() => {})
  //         .then(() => console.log("done"));
  //     } else {
  //       return;
  //     }
  //   });
  // }

  // function editsubcategorytoproduct(cat, subcat, newsubcat) {
  //   Product.findOne({ category: cat }).then((categoryexist) => {
  //     if (categoryexist) {
  //       categoryexist.subcategories[newsubcat] =
  //         categoryexist.subcategories[subcat];
  //       delete categoryexist.subcategories[subcat];
  //       categoryexist.markModified("subcategories");
  //       categoryexist
  //         .save()
  //         .then(() => {})
  //         .then(() => console.log("done"));
  //     } else {
  //       return;
  //     }
  //   });
  // }

  app.post("/addcategory", auth, (req, res) => {
    var cat = req.body.category.toLowerCase();
    allcategories.find({}).then((det) => {
      if (det.length === 0) {
        var dat = new allcategories({ categories: [{ name: cat, sub: [] }] });
        dat
          .save()
          .then(() => {
            // addcategorytoproduct(cat);
          })
          .then(() => res.json({ message: "category added", status: 200 }));
      } else {
        allcategories
          .findOne({ "categories.name": { $all: [cat] } })
          .then((data) => {
            // console.log(data);
            if (data === null) {
              allcategories.find({}).then((categorydata) => {
                categorydata[0].categories.push({ name: cat, sub: [] });
                categorydata[0]
                  .save()
                  .then(() => {
                    // addcategorytoproduct(cat);
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

  app.post("/addsubcategory", auth, (req, res) => {
    var cat = req.body.category.toLowerCase();
    var subcat = req.body.subcategory.toLowerCase();
    allcategories.find({}).then((data) => {
      if (data.length === 0) {
        res.json({ message: "pls add a category first", status: 208 });
      } else {
        var t;
        data[0].categories.filter((c, i) => {
          if (c.name === cat) {
            t = i;
          }
        });
        if (t >= 0) {
          var t2;
          data[0].categories[t].sub.filter((c, i) => {
            // return c.name === cat;
            if (c === subcat) {
              t2 = i;
            }
          });
          if (t2 >= 0) {
            res.json({ message: "subcategory already exist", status: 208 });
          } else {
            // addsubcategorytoproduct(cat, subcat);
            data[0].categories[t].sub.push(subcat);
            data[0].markModified("categories");
            data[0]
              .save()
              .then((r) => {})
              .then(() => {
                res.json({ message: "subcategory added", status: 200 });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      }
    });
  });

  // EDIT/CHANGE A CATEGORY NAME
  app.post("/editcategoryname", auth, (req, res) => {
    var cat = req.body.category.toLowerCase();
    var newcat = req.body.newcategory.toLowerCase();
    allcategories
      .findOne({ "categories.name": { $all: [newcat] } })
      .then((newdat) => {
        if (newdat) {
          res.json({ message: "category name exist", status: 208 });
        } else {
          // editcategorytoproduct(cat, newcat);
          allcategories
            .findOne({ "categories.name": { $all: [cat] } })
            .then((data) => {
              // console.log(data)
              if (data) {
                data.categories.filter((dat) => {
                  if (dat.name === cat) {
                    dat.name = newcat;
                  }
                });
                data.markModified("categories");
                data
                  .save()
                  .then((r) => {})
                  .then(() => {
                    console.log("done");
                    res.json({ message: "category updated", status: 200 });
                  });
              } else {
                res.json({ message: "category already updated", status: 208 });
              }
            });
        }
      });
  });

  // EDIT/CHANGE A SUBCATEGORY NAME
  app.post("/editsubcategoryname", auth, (req, res) => {
    var cat = req.body.category.toLowerCase();
    var subcat = req.body.subcategory.toLowerCase();
    var newsubcat = req.body.newsubcategory.toLowerCase();
    allcategories.find({}).then((data) => {
      var t;
      data[0].categories.filter((c, i) => {
        if (c.name === cat) {
          t = i;
        }
      });
      if (t >= 0) {
        var t2, t3;
        data[0].categories[t].sub.filter((c, i) => {
          // return c.name === cat;
          if (c === subcat) {
            t2 = i;
          }
          if (c === newsubcat) {
            t3 = i;
          }
        });
        console.log(t3);
        if (t3) {
          res.json({ message: "subcategory exist", status: 208 });
        } else if (t2 >= 0) {
          // editsubcategorytoproduct(cat, subcat, newsubcat);
          data[0].categories[t].sub[t2] = newsubcat;
          data[0].markModified("categories");
          data[0]
            .save()
            .then((r) => {})
            .then(() => {
              res.json({ message: "subcategory added", status: 200 });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    });
  });

  var product = new Product({
    name: "fluvic acid",
    description: "lorem ipsum",
    ingredients: "hihiihih hihii",
    uses: "ghghhfyf",
    image: "fnfnbfbf",
    price: 5000,
    category: "gg",
    subcategory: "luy",
  });
  // product.save();

  
  // Product.findOne({ category: "health" }).then((prod) => console.log(prod));

  // UPLOADS
  app.post(
    "/upload/product",
    auth,
    upload.fields("product-image"),
    (req, res) => {
      console.log(req.body, req.file);
      // console.log(req.body, req.file);
    }
  );

  // PASSWORD**********
  app.post(
    "/upload/product",
    auth,
    upload.fields("product-image"),
    (req, res) => {
      console.log(req.body, req.file);
      // console.log(req.body, req.file);
    }
  );
};

module.exports = router;
