const { ObjectID } = require("mongodb");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orderSchema = new Schema({
  transactionId: {
    type: String,
  },
  transactionRef: {
    type: String,
  },
  customerDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
    },
    number: {
      type: String,
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
      _id: {
        type: ObjectID,
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
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = new mongoose.model("order", orderSchema);
