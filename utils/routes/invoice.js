

var invoice = (order,res) => {
  //Import the library into your project
    var easyinvoice = require("easyinvoice");
    var fs = require("fs");
    const path = require("path")

    var img = fs.readFileSync(
      path.join(__dirname, "../../public/img/logo/logo.png"),
      "base64"
    );
  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
    currency: "NGN", //See documentation 'Locales and Currency' for more info
    taxNotation: "vat", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: img, //or base64
    background: "", //or base64 //img or pdf
    sender: {
      company: "HoneyCare Pharmacy and Beauty Hub",
      address: "https://honeycarepharmacy.com",
      zip: "",
      city: "Akure",
      country: "Nigeria",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    client: {
      company: order.customerDetails.name,
      address: order.customerDetails.address,
      zip: "",
      city: "",
      country: "Nigeria",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: order._id,
    invoiceDate: order.customerDetails.date,
    products: order.products.map((prod) => {
      return {
        quantity: prod.incart,
        description: prod.name,
        tax: "",
        price: prod.price,
      };
    }),
    bottomNotice:
      "transaction_id:" +
      order.transactionId +
      " " +
      "transaction_ref:" +
      order.transactionRef,
  };

  //Create your invoice! Easy!
  easyinvoice.createInvoice(data, async function (result) {
    //The response will contain a base64 encoded PDF file
      try {
          await fs.writeFileSync(path.join(__dirname, "../../private/invoice", order.id + ".pdf"), result.pdf, "base64");
          res.sendFile(
            path.join(__dirname, "../../private/invoice", order.id + ".pdf")
          );
      } catch (err) {
          console.error(err)
      }
  });
}

module.exports = invoice;