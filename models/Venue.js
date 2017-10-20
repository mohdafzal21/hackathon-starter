const mongoose = require('mongoose');

// const venueSchema = new mongoose.Schema({
//     name: String,
//     Address: String,
//     email:{type:String,unique:true},
//     phone:Number,
//     Description:String
// }, { timestamps: true });

const sportNameSchema = new mongoose.Schema({
    name:String
});

const venuePhotoSchema = new mongoose.Schema({
    name:String,
    path:String,
});

const venuePriceSchema = new mongoose.Schema({
    timing:Number,
    price:Number
});

const venueReviewSchema = new mongoose.Schema({
    rating:Number,
    Description:String
});

const venueSchema = new mongoose.Schema({
    name: String,
    address: String,
    email:String,
    phone:Number,
    description:String,

    photo:[venuePhotoSchema],
    review:[venueReviewSchema],
    sports:[sportNameSchema]
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;

