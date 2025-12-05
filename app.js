// step1: Import express and mongoose
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// View Engine setup
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Public folder setup
app.use(express.static(path.join(__dirname, "/public")));

// DB connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// MODEL
const Listing = require("./models/Listing");

// ROUTES
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Show all listings
app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});

// Create form
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect("/listings");
});

// Edit form
app.get("/listings/:id/update", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/update.ejs", { listing });
});

// Update
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body);
  res.redirect("/listings");
});

// Delete
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// Show single listing
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.listen(8080, () => console.log("Server running at 8080"));
