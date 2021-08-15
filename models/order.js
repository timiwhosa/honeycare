var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orderSchema = new Schema({
  customerDetails: {
    name: {
      type: String,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  products: [
    {
      id: {
        type: Number,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      subsection: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      incart: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});
module.exports = new mongoose.model("order", orderSchema);
