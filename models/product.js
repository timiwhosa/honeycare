var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: String, required: true },
  uses: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
});
module.exports = new mongoose.model("product", productSchema);




  // products: [
  //   {
  //     category: {
  //       type: String,
  //       required: true,
  //     },
  //     subcategory: [
  //       {
  //         name: {
  //           type: String,
  //           required: true,
  //         },
  //         products: {
  //           name: {
  //             type: String,
  //             required: true,
  //           },
  //           discription: {
  //             type: String,
  //             required: true,
  //           },
  //           ingredients: {
  //             type: String,
  //             required: true,
  //           },
  //           uses: {
  //             type: String,
  //             required: true,
  //           },
  //           image: {
  //             type: String,
  //             required: true,
  //           },
  //           price: {
  //             type: Number,
  //             required: true,
  //           },
  //         },
  //       },
  //     ],
  //     subcategories: [{ type: String }],
  //   },
  // ],