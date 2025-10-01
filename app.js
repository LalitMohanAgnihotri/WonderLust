// step1: Import express and mongoose
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// set the view engine to ejs
const path = require('path');
app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// import the Listing model
const Listing = require('./models/Listing'); 

// import method-override to support PUT and DELETE methods from forms
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// import ejs 
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

// to use pubilc folder css
app.use(express.static(path.join(__dirname,"/public")));

// step4: Connect to MongoDB

const dbURI = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
}

main().then(() => {
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection error:', err);
});

// step5: Define routes

// app.get("/testlisting", async(req, res) => {
//     const newListing = new Listing({
//         title: "Beautiful Beach House",
//         description: "A lovely beach house with stunning ocean views.", 
//         image: {
//             filename: "beachhouse.jpg",
//             url: "https://example.com/images/beachhouse.jpg"
//         },
//         price: 2500,
//         location: "Malibu",
//         country: "USA"
//     });
//     await newListing.save();
//     res.send(newListing);
// });

// route to get all listings
app.get("/listings",async(req, res) => {
    const alllistings=await Listing.find({})
    res.render("listings/index.ejs", {alllistings});
});

// create new listing form
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// post route to create a new listing
app.post("/listings", async(req, res) => {
    let {title, description, image, price, location, country} = req.body; 
    let newListing = new Listing({
        title: title,
        description: description,   
        image:image,
        price: price,
        location: location,
        country: country
    });
    await newListing.save();
    res.redirect("/listings");
}
);

// update listing form
app.get("/listings/:id/update", async(req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/update.ejs", {listing});
});
// update listing put route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;      
    let {title, description, image, price, location, country} = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(id, {
        title: title,   
        description: description,
        image:image,
        price: price,
        location: location,
        country: country
    }, {new: true, runValidators: true});
    res.redirect("/listings"); // Redirect to the listings index page
});

// Delete route

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
});

// route to get a specific listing by id
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});


// step3: Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World');
});


// step2: Listen on port 8080
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});