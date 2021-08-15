// flutter wave
// Flutter Wave
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);
const open = require("open");
const payload = {
  card_number: "5531886652142950",
  cvv: "564",
  expiry_month: "09",
  expiry_year: "21",
  currency: "NGN",
  amount: "100",
  redirect_url: "https://honeycare.herokuapp.com",
  fullname: "ifo tim",
  email: "olufemi@flw.com",
  phone_number: "0902620185",
  enckey: "FLWSECK_TEST08dfa89ce584",
  tx_ref: "MC-32444ee--4eerye4euee3rerds4423e43r", // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
};

const chargeCard = async () => {
  try {
    const response = await flw.Charge.card(payload);
    console.log(response, "hello");
    if (response.meta.authorization.mode === "pin") {
      let payload2 = payload;
      payload2.authorization = {
        mode: "pin",
        fields: ["pin"],
        pin: 3310,
      };
      const reCallCharge = await flw.Charge.card(payload2);

      const callValidate = await flw.Charge.validate({
        otp: "12345",
        flw_ref: reCallCharge.data.flw_ref,
      });
      console.log(callValidate, "cval");
    }
    if (response.meta.authorization.mode === "redirect") {
      var url = response.meta.authorization.redirect;
      console.log(url);
      open(url);
    }

    console.log(response, "resp2");
  } catch (error) {
    console.log(error);
  }
};

// chargeCard();

// function postiut() {
//   fetch("https://api.flutterwave.com/v3/payments", {
//     method: "post",
//     Authorization: `Bearer ${process.env.SECRET_KEY}`,
//     body: {
//       tx_ref: "hooli-tx-1920bbtytty",
//       amount: "100",
//       currency: "NGN",
//       redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
//       payment_options: "card",
//       meta: {
//         consumer_id: 23,
//         consumer_mac: "92a3-912ba-1192a",
//       },
//       customer: {
//         email: "user@gmail.com",
//         phonenumber: "080****4528",
//         name: "Yemi Desola",
//       },
//       customizations: {
//         title: "Pied Piper Payments",
//         description: "Middleout isn't free. Pay the price",
//         logo: "https://assets.piedpiper.com/logo.png",
//       },
//     },
//   })
//     .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
// postiut();
