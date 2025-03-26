const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateBooking,
} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// "/"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//:id
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditform)
);

router.get(
  "/:id/newBookingCreate",
  isLoggedIn,
  validateBooking,
  wrapAsync(listingController.renderBookingForm)
);
router.post(
  "/:id/newBooking",
  isLoggedIn,
  validateBooking,
  wrapAsync(listingController.savedBooking)
);

router.delete(
  "/:id/bookings/:bookigId",
  isLoggedIn,
  isOwner,
  validateBooking,
  wrapAsync(listingController.deleteBooking)
);
router.get("/listings/trendings", listingController.trendings);
module.exports = router;
