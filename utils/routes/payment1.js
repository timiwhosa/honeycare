// const paystack = (request) => {
//   const MySecretKey = "Bearer sk_test_aa1744c3094d72f75fd9a6f2f1595bcca4f4e270";
//   //sk_test_xxxx to be replaced by your own secret key
//   const initializePayment = (form, mycallback) => {
//     const option = {
//       url: "https://api.paystack.co/transaction/initialize",
//       headers: {
//         authorization: MySecretKey,
//         "content-type": "application/json",
//         "cache-control": "no-cache",
//       },
//       form,
//     };
//     const callback = (error, response, body) => {
//       return mycallback(error, body);
//     };
//     request.post(option, callback);
//   };
//   const verifyPayment = (ref, mycallback) => {
//     const option = {
//       url:
//         "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
//       headers: {
//         authorization: MySecretKey,
//         "content-type": "application/json",
//         "cache-control": "no-cache",
//       },
//     };
//     const callback = (error, response, body) => {
//       return mycallback(error, body);
//     };
//     request(option, callback);
//   };
//   return { initializePayment, verifyPayment };
// };

const paystack = () => {
  const https = require("https");
  const MySecretKey = "Bearer sk_test_aa1744c3094d72f75fd9a6f2f1595bcca4f4e270";
  // const params = JSON.stringify({
  //   email: "customer@email.com",
  //   amount: "20000",
  // });
  const initializePayment = (params, res) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
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
          // console.log(response)
          res.json({
            data: response.data.authorization_url,
            reference: response.data.reference,
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
  const verifyPayment = (ref, response) => {
    const https = require("https");
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `transaction/verify/${ref.ref}`,
      method: "GET",
      headers: {
        Authorization: MySecretKey,
        "User-Agent": "Chrome/93.0.4577.63",
      },
    };
    // console.log(options.path)
    var req = https
      .request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log(data);
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
    // req.setTimeout(5000)
    req.end();
  };

  return { initializePayment, verifyPayment };
};
module.exports = paystack;
