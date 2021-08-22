const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var user = new Schema({
    name: { type: String, required: true },
    password: {type: String, required: true}
})

module.exports = new mongoose.model("user", user)