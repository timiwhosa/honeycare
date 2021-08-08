var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: string,
  description: string,
  image: {
    data: Buffer,
    contentType: String,
  },
  price: Number,
});
module.exports = new mongoose.model("product", productSchema);