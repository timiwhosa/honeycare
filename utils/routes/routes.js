const router = (
  app,
  public,
  path,
  moment,
  auth,
  Jsonparser,
  Urlparser
) => {
  // Get pages Request
  var mongodb = require("mongodb");
  const multer = require("multer");
  var fs = require("fs");
  var mongoose = require("mongoose");
  const request = require("request");
  const _ = require("lodash");
  var fs = require("fs");
  String.prototype.escape = function () {
    var tagtoreplace = {
      "&": "&amp;",
      "<": "&lt",
      ">": "&gt",
      "=": "",
      "(": "l",
      ")": "l",
      script: " ",
      Script: " ",
      '"': " ",
      "`": " ",
      ".": " ",
    };
    return this.replace(/[(.)&<>`=]/g, function (tag) {
      return tagtoreplace[tag] || tag;
    });
  };

  // var visit = JSON.parse(fs.readFileSync(path.join(__dirname, "../views.json")));

  //   async function visits(page) {
  //     var vv = 0;
  //     for (let v = 0; v < visit.length; v++) {
  //       if (visit[v].page == page) {
  //         visit[v].visit += 1;
  //         fs.writeFileSync(
  //           path.join(__dirname, "../views.json"),
  //           JSON.stringify(visit, null, 2)
  //         );
  //         vv = 1;
  //       }
  //     }
  //     if (vv == 0) {
  //       visit.push({
  //         page,
  //         visit: 1,
  //       });
  //       fs.writeFileSync(
  //         path.join(__dirname, "../views.json"),
  //         JSON.stringify(visit, null, 2)
  //       );
  //     }
  //   }

  app.get("/", (req, res) => {
    // visits(page);
    res.json("hi");
  });
  app.get(
    "/product/:category/:subcategory/singleproduct/:productID",
    (req, res) => {
      //visits(req._parsedOriginalUrl.href);
      res.sendFile(public + "/html/singleproduct.html");
    }
  );
  app.get("/product/image/:id", (req, res) => {
    // //visits(req._parsedOriginalUrl.href);
    var file = public + "/img/product/allproducts/" + req.params.id;
    if (!fs.existsSync(file)) {
      console.log("File not found");
      res.end("file not found");
    } else {
      res.sendFile(file);
    }
  });

  // *********************************
  // MODELS
  const order = require(path.join(__dirname, "../../models/order"));
  const refill = require(path.join(__dirname, "../../models/refill"));
  const Product = require(path.join(__dirname, "../../models/product"));
  const allcategories = require(path.join(__dirname, "../../models/category"));
  const Contact = require(path.join(__dirname, "../../models/contact"));

  // PAYMENT
  const { initializePayment, verifyPayment } = require("./payment.js")();

  const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, public + `/img/product/allproducts`);
    },
    filename: async function (req, res, cb) {
      if (req.query.type === "update") {
        cb(
          null,
          req.query._id +
            "." +
            res.originalname.replace(/\s/g, "-").split(".")[1]
        );
      } else {
        req.body._id = await mongodb.ObjectID();
        cb(
          null,
          req.body._id +
            "." +
            res.originalname.replace(/\s/g, "-").split(".")[1]
        );
      }
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        if (req.query.type === "update") {
          let allfiles = fs.readdirSync(public + "/img/product/allproducts");
          if (allfiles.includes(`${req.query._id}.png`)) {
            fs.unlinkSync(
              public + "/img/product/allproducts/" + `${req.query._id}.png`
            );
            cb(null, true);
          } else if (allfiles.includes(`${req.query._id}.jpg`)) {
            fs.unlinkSync(
              public + "/img/product/allproducts/" + `${req.query._id}.jpg`
            );
            cb(null, true);
          }
          cb(null, true);
        } else if (req.query.type === "upload") {
          // FOR UPLOADS
          // console.log(req.query);
          Product.find({
            $and: [
              { name: req.query.name.toLowerCase() },
              { category: req.query.category.toLowerCase() },
              { subcategory: req.query.subcategory.toLowerCase() },
            ],
          }).then((data) => {
            if (data.length > 0) {
              cb(new Error({ message: "Product and Product name exist" }));
            }
            cb(null, true);
          });
        }
      } else {
        cb(new Error("invalid image"));
      }
    },
  }).array("Product-image");
  const Refillstorage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, path.join(__dirname, "../../private/refills"));
    },
    filename: (req, res, cb) => {
      cb(
        null,
        req.query.phone +
          "-" +
          res.originalname
            .replace(/\&/g, " ")
            .replace(".exe", "")
            .replace(/\s+/g, "-")
      );
    },
  });
  var RefillUpload = multer({
    storage: Refillstorage,
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new Error("invalid file type image"));
      }
    },
  }).array("refill");

  // GET REQUEST CONTINUES
  app.get("/search", async (req, res) => {
    var input = req.query.input.toLowerCase().split(" ");
    var m = [];
    input.map((i) => {
      m.push(
        { name: { $regex: i } },
        {
          category: { $regex: i },
        },
        {
          subcategory: { $regex: i },
        },
        {
          description: { $regex: i },
        }
      );
    });
    Product.find({
      $or: m,
    }).then((data) => {
      if (data.length > 0) {
        res.json({ data, status: 200 });
      } else {
        res.json({
          message: "Sorry we are currently out of stock of such Product",
        });
      }
    });
  });

  app.get("/search/:search", (req, res) => {
    //visits(req._parsedOriginalUrl.href);
    res.sendFile(public + "/html/search.html");
  });
  app.get("/products/:category/:subcategory", (req, res) => {
    var cat = req.params.category;
    var subcat = req.params.subcategory;
    Product.find({ category: cat }).then(async (data) => {
      if (data.length >= 1) {
        var productstosend = [];
        Object.entries(data).forEach((dat) => {
          if (dat[1].subcategory === subcat) {
            productstosend.push(dat[1]);
          }
        });
        if (productstosend.length >= 1) {
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
        var otherproducttosend = [];
        var i = 1;
        Object.entries(data).forEach((dat) => {
          if (dat[1].subcategory === subcat) {
            if (String(dat[1]._id) === String(id)) {
              producttosend = dat[1];
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
    //visits(req._parsedOriginalUrl.href);
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
    //visits(req._parsedOriginalUrl.href);
  });
  app.get("/cart", (req, res) => {
    res.sendFile(public + "/html/cart.html");
    //visits(req._parsedOriginalUrl.href);
  });
  app.get("/refill", (req, res) => {
    res.sendFile(public + "/html/refill.html");
    //visits(req._parsedOriginalUrl.href);
  });
  app.get("/favicon.ico", (req, res) => {
    res.send("hi");
  });

  // social
  app.get("/contact", (req, res) => {
    res.redirect("https://wa.me/+2348071360049");
    //visits(req._parsedOriginalUrl.href);
  });
  app.get("/instagram", (req, res) => {
    res.redirect("https://instagram.com/honeycare_pnb");
    //visits(req._parsedOriginalUrl.href);
  });

  // Fetch Request
  app.get("/popular", (req, res) => {
    Product.aggregate([{ $sample: { size: 3 } }]).then((data) => {
      if (data.length > 0) {
        res.json(data);
      }
    });
  });

  // Post Request
  app.post("/contact", Jsonparser, (req, res) => {
    // customer message

    var customercontact = new Contact({
      name: req.body.name.escape(),
      number: req.body.number.toString().escape(),
      message: req.body.message.escape(),
      time: moment(Date.now()).format("h:mma"),
      date: moment(Date.now()).format("DD/MM/YYYY"),
    });
    customercontact.save().then((data) => {
      res.json({
        message: "We have received your message and would contact you shortly",
      });
    });
  });

  app.post("/uploadRefill", Urlparser, (req, res) => {
    RefillUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
        return res.json({ message: "error occured while uploading file" });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error(err);
        return res.json({ message: "Invalid file type" });
      }
      var img = req.files[0].filename;
      var refil = new refill({
        name: req.body.name,
        status: "recent",
        number: req.body.phone,
        time: moment(Date.now()).format("h:mma"),
        date: moment(Date.now()).format("DD/MM/YYYY"),
        image: `/admin/refill-img?img=${img
          .replace(/\&/g, " ")
          .replace(".exe", "")
          .replace(/\s+/g, "-")}`,
      });
      refil.save().then((data) => {
        if (data) {
          res.json({
            message: " Request Received, we will contact you shortly",
            status: 200,
          });
        }
      });
    });
  });

  app.post("/pay", Jsonparser, async (req, res) => {
    var Singleorder = {
      name: req.body.name.escape(),
      email: req.body.email,
      number: req.body.number.toString().escape(),
      address: req.body.address.escape(),
      time: moment(Date.now()).format("h:mma"),
      date: moment(Date.now()).format("DD/MM/YYYY"),
      paid: false,
      status: "recent",
      total: 0,
      products: [],
    };
    if (req.body.productBought) {
      for (let i = 0; i < req.body.productBought.length; i++) {
        var prod = req.body.productBought[i];
        var _id = mongodb.ObjectID(prod.id);
        Product.findOne({ _id: _id }).then((product) => {
          if (product) {
            Singleorder.total += product.price * prod.incart;
            Singleorder.products.push({
              _id: _id,
              incart: prod.incart,
              price: product.price,
              name: product.name,
              image: product.image,
            });
            if (i === req.body.productBought.length - 1) {
              saveorder(Singleorder, res);
            }
          }
        });
      }
    }

    async function saveorder(singleorder, res) {
      var neworder = new order({
        customerDetails: singleorder,
        products: singleorder.products,
      });
      neworder.save().then(async (single) => {
        const form = {
          tx_ref: single._id,
          amount: single.customerDetails.total,
          currency: "NGN",
          redirect_url: "https://localhost:3001/cart",
          payment_options: "card",
          meta: {
            consumer_id: single._id,
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: single.customerDetails.email,
            phonenumber: single.customerDetails.number,
            name: single.customerDetails.name,
          },
          customizations: {
            title: "Honeycare pnb",
            description: "Health and beauty",
            logo: "https://assets.piedpiper.com/logo.png",
          },
        };
        res.customerId = single._id;
        initializePayment(JSON.stringify(form), res);
      });
    }
  });

  app.post("/verify/callback", (req, res) => {
    var confirm = req.query;
    verifyPayment(confirm, order, res);
  });

  app.get("/khk", (req, res) => {
    res.sendFile(__dirname + "/hi.html");
  });

  // ***************************************************
  // ADMIN

  //   GET request
  var private = path.join(__dirname, "../../private");
  app.get("/adams", auth, (req, res) => {
    res.sendFile(private + "/admin/adams.html");
  });
  app.get("/admin/style.css", auth, (req, res) => {
    // clearance required
    res.sendFile(private + "/admin/style.css");
  });
  app.get("/admin/refill-img", auth, (req, res) => {
    // clearance required
    res.sendFile(private + "/refills/" + req.query.img);
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
    if (allcategory.length > 0) {
      res.json({ allcategory, status: 200 });
    } else {
      res.json({ message: "categories not added", status: 208 });
    }
  });
  app.get("/allcontacts", auth, async (req, res) => {
    var contact = await Contact.find({});
    if (contact.length > 0) {
      res.json({ contact, status: 200 });
    } else {
      res.json({ message: "None", status: 208 });
    }
  });

  // POST request

  app.post("/order-delivered", Jsonparser, auth, async (req, res) => {
    // order delivered
    var id = mongodb.ObjectId(req.body.id);
    order
      .updateOne(
        { _id: id },
        { $set: { "customerDetails.status": "delivered" } }
      )
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });
  app.post("/order-notdelivered", Jsonparser, auth, async (req, res) => {
    // order not delivered
    var id = mongodb.ObjectId(req.body.id);
    order
      .updateOne({ _id: id }, { $set: { "customerDetails.status": "recent" } })
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });

  app.post("/refill-delivered", Jsonparser, auth, async (req, res) => {
    // refill delivered
    var id = mongodb.ObjectId(req.body.id);
    refill
      .updateOne({ _id: id }, { $set: { status: "delivered" } })
      .then(() => {
        res.json({ message: "updated" });
      })
      .catch((err) => {
        console.error(err);
        res.end();
      });
  });
  function editcategorytoproduct(cat, newcat) {
    Product.updateMany({ category: cat }, { $set: { category: newcat } }).then(
      (categoryexist) => {
        console.log("done");
      }
    );
  }

  function editsubcategorytoproduct(cat, subcat, newsubcat) {
    Product.updateMany(
      { category: cat, subcategory: subcat },
      { $set: { subcategory: newsubcat } }
    ).then((categoryexist) => {
      console.log("done");
    });
  }

  app.post("/addcategory", Jsonparser, auth, (req, res) => {
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

  app.post("/addsubcategory", Jsonparser, auth, (req, res) => {
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
  app.post("/editcategoryname", Jsonparser, auth, (req, res) => {
    var cat = req.body.category.toLowerCase();
    var newcat = req.body.newcategory.toLowerCase();
    allcategories
      .findOne({ "categories.name": { $all: [newcat] } })
      .then((newdat) => {
        if (newdat) {
          res.json({ message: "category name exist", status: 208 });
        } else {
          editcategorytoproduct(cat, newcat);
          allcategories
            .findOne({ "categories.name": { $all: [cat] } })
            .then((data) => {
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
  app.post("/editsubcategoryname", Jsonparser, auth, (req, res) => {
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
          if (c === subcat) {
            t2 = i;
          }
          if (c === newsubcat) {
            t3 = i;
          }
        });
        if (t3) {
          res.json({ message: "subcategory exist", status: 208 });
        } else if (t2 >= 0) {
          editsubcategorytoproduct(cat, subcat, newsubcat);
          data[0].categories[t].sub[t2] = newsubcat;
          data[0].markModified("categories");
          data[0]
            .save()
            .then((r) => {})
            .then(() => {
              res.json({ message: "subcategory Edited", status: 200 });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    });
  });

  // UPLOADS
  app.post("/UpdateProduct", auth, Urlparser, (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.end({ message: "error occured while uploading file" });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.json({ message: "invalid file type" });
      }
      // Everything went fine.
      var id = mongodb.ObjectID(req.body._id);
      req.body.image = "/product/image/" + req.files[0].filename;
      Product.updateOne({ _id: id }, req.body).then((data) => {
        if (data.ok === 1) {
          res.json({ message: "product details updated", status: 200 });
        } else {
          res.json({ message: "error occured", status: 208 });
        }
      });
    });
  });
  app.post("/upload/product", auth, Urlparser, (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.json({ message: "error occured while uploading file" });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error(err)
        return res.json({ message: "Product and Product name exist" });
      }
      // Everything went fine.
      req.body.image = "/product/image/" + req.files[0].filename;
      // console.log(req.body);
      var prod = new Product(req.body);
      prod.save().then((data) => {
        if (data) {
          res.json({ message: "Product added", status: 200 });
        }
      });
    });
  });
  app.post("/deleteProduct", Jsonparser, (req, res) => {
    var id = req.body.id.split("image/")[1].split(".")[0];
    var _id = mongodb.ObjectID(id);
    Product.deleteOne({ _id: _id }).then((data) => {
      if (data.deletedCount === 1) {
        fs.unlink(
          public + "/img/product/allproducts/" + req.body.id.split("image/")[1],
          (err) => {
            if (err) {
              console.error(err);
              res.json({ message: "product Not deleted", status: 208 });
            } else {
              res.json({ message: "product deleted", status: 200 });
            }
          }
        );
      }
    });
  });
};

module.exports = router;

