const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Booking = require("../models/booking.js");
//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("./listings/index.ejs", { allListings });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

//create
module.exports.createListing = async (req, res, next) => {
  // console.log(req.body);
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//edit
module.exports.renderEditform = async (req, res) => {
  console.log(req.body);

  let { id } = req.params;
  // const listing = await Listing.findById(id);
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "New Listing Updated!");

  res.redirect(`/listings/${id}`);
};

//delete
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");

  res.redirect("/listings");
};
// Render Booking Form
module.exports.renderBookingForm = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  res.render("./listings/newBooking.ejs", { listing });
};

// Save Booking
module.exports.savedBooking = async (req, res) => {
  let listing = await Listing.findById(req.params.id).populate("bookings");
  console.log(listing.bookings);
  let newBooking = new Booking(req.body.bookings);
  listing.bookings.push(newBooking);

  await newBooking.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteBooking = async (req, res) => {
  let { id, bookingId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { bookings: bookingId } });
  await Booking.findByIdAndDelete(bookingId);
  res.redirect(`/listings/${id}`);
};

module.exports.trendings = async (req, res) => {
  // let [trending] = await Listing.find({ country: "United States" });
  // console.log(trending);
  // res.send("hello");a
  console.log("hellow");
};
