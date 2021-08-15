const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    categories:{type: Array, required: true}
})

module.exports = new mongoose.model("allcategories", categorySchema);