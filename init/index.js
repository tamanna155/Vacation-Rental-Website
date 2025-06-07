const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

main().then(()=>{
    console.log("Connection eshtablished");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    for (dat of initData.data){
        let location= dat.location;
        let country = dat.country;
        
        let response= await geocodingClient.forwardGeocode({
                query: location + ", " + country,
                limit: 1
            })
            .send()
        
        dat.geometry= response.body.features[0].geometry;
    }

    initData.data=initData.data.map((obj)=> ({...obj, owner: '6808c989fee9118037490cb4'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}   

initDB();