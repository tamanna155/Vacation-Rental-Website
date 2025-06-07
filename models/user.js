const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
});
//automatically creates pw and username
//This plugin automatically implements username, hashing and hashed salted password to the userSchema
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);