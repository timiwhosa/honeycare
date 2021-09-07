
var random;
const flutterwave = () => {
    const https = require("https");
    const mongodb = require("mongodb")
    const MySecretKey =
      "Bearer " + process.env.Secret_key ;

    const initializePayment = (params,res) => {
          const options = {
            hostname: "api.flutterwave.com",
            port: 443,
            path: "/v3/payments",
            method: "POST",
            headers: {
              Authorization: MySecretKey,
              "Content-Type": "application/json",
            },
          };
          const req = https
            .request(options, (paystackres) => {
              let data = "";
              paystackres.on("data", (chunk) => {
                data += chunk;
              });
              paystackres.on("end", () => {
                var response = JSON.parse(data);
                random =response;
                console.log(response)
                res.json({
                  data: response.data.link,
                  id: res.customerId,
                  status: 200,
                });
              });
            })
            .on("error", (error) => {
              console.error(error);
            });
          req.write(params);
          req.end();
    };
    const verifyPayment = (confirm, order, resp) => {

        const https = require("https");
        const options = {
          hostname: "api.flutterwave.com",
          port: 443,
          path: `/v3/transactions/${confirm.verifyId}/verify`,
          method: "GET",
          headers: {
            Authorization: MySecretKey,
            "User-Agent": "Chrome/93.0.4577.63",
          },
        };
        const req = https
            .request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    var response = JSON.parse(data);
                    var invoice = require("./invoice.js");
                    if (
                        response.status === "success" &&
                        response.data.tx_ref === confirm.reference &&
                        parseInt(response.data.id) === parseInt(confirm.verifyId)
                    ) {
                        var id = mongodb.ObjectID(confirm.id);
                        order.findOne({ _id: id }).then((data) => {
                            if (data) {
                                order.updateOne(
                                    { _id: id },
                                    {
                                        $set: {
                                            "customerDetails.paid": true,
                                            transactionRef: response.data.tx_ref,
                                            transactionId: response.data.id,
                                        },
                                    }
                                )
                                    .then((d) => {
                                        invoice(data, resp);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        resp.end();
                                    });
                            }
              
                        })
            
                    }
                })
            });
            req.end();
    };
    return {initializePayment ,verifyPayment}
}

module.exports = flutterwave;

