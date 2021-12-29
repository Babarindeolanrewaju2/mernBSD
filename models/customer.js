const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  address: String,
  comments: String,
  date: {
    type: String,
    default: Date.now(),
  },
});

// Model
const Customer = mongoose.model("Customers", CustomerSchema);

module.exports = Customer;
