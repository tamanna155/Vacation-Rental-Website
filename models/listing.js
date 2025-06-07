const mongoose=require('mongoose');
const Review=require('./review.js');

const listingSchema= mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image:{
        url: String,
        filename: String,
    },
    price: Number,
    location: {
        type:String,
        match: [/^[a-zA-Z\s]+$/],
    },
    country: {
        type:String,
        match: [/^[a-zA-Z\s]+$/],
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reviews',
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates :{
            type: [Number],
            required: true,
        }
    }
});

//Deleting middleware
listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing= mongoose.model('Listing', listingSchema);
module.exports=Listing;
