const listing=require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index= async (req,res)=>{
    const allListings=await listing.find({});
    res.render('listings/index.ejs',{allListings});
}

module.exports.renderNewForm= (req,res)=>{
    res.render('listings/new.ejs');
}

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id).
    populate({
        path:'reviews', 
        populate:{
            path:'author' //nested populate; listings-> [reviews ->user of reviews] -> owner
        },
    }).populate('owner');
    console.log(list);
    if(!list){
        req.flash('error','The listing does not exists');
        res.redirect('/listings');
    } else{
        res.render('listings/show.ejs',{list});
    }
}

module.exports.createListing=async(req,res)=>{
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location+", "+req.body.listing.country,
        limit: 1
    })
    .send()
    console.log(response.body.features);

    const newList=new listing(req.body.listing);
    const url=req.file.path;
    const filename=req.file.filepath;
    newList.owner=req.user._id;
    newList.image={url,filename};
    newList.geometry=response.body.features[0].geometry;
    await newList.save();
    req.flash('success','new listing was created');
    res.redirect('/listings');
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id);
    if(!list){
        req.flash('error','The listing does not exists');
        res.redirect('/listings');
    }
    let originalImage = list.image.url;
    originalImage= originalImage.replace('/upload', '/upload/w_200,h_150');
    res.render('listings/edit.ejs',{list, originalImage});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let list = await listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined'){
        const url=req.file.path;
        const filename=req.file.filepath;
        list.image = {url,filename};
        await list.save();
    }

    req.flash('success','listing was updated');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success','listing was deleted');
    res.redirect('/listings');
}