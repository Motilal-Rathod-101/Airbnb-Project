const Joi = require("joi");
const booking = require("./models/booking");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
    mobile: Joi.string().required().min(10).max(12), // mobile numbers are typically stored as strings
    aadhar: Joi.string().required(),
  }), // Added the missing parentheses here
});
