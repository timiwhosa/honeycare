const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = new mongoose.model("contact", contactSchema);