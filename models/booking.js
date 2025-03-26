// const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  fullname: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
  },

  mobile: {
    type: String,
  },
  aadhar: {
    type: String,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
