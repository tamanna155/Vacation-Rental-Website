if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
const express= require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User= require('./models/user.js');
const ExpressError=require('./utils/ExpressError.js');
const listingController= require('./controllers/listings.js');

const listingRouter= require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const wrapAsync = require('./utils/wrapAsync.js');

let port=3000;
const dbUrl=process.env.ATLAS_DB;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on('error',()=>{
    console.log("Error in MONGO session Store",err);
});

const sessionOptions= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser= req.user;
    next();
});

main().then(()=>{
    console.log("Connection eshtablished");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.get('/',wrapAsync(listingController.index));

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//Error handler middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render('error.ejs',{statusCode,message});
});

app.listen(port,()=>{
    console.log(`Access this here http://localhost:${port}`);
});