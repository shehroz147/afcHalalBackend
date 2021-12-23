const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const {json} = require("body-parser");
const http = require("http");
const server = http.createServer(app);

// Required Routes
const adminRoutes = require('./Route/AdminRoutes');
const userRoutes = require('./Route/UserRoutes');


const dbUrl = 'mongodb://localhost:27017/AfcHalalMeat';

// Connect Mongo DB
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology:true},
(err) => {
    if (!err) {
        console.log('Connection Successful');
    } else {
        console.log('Connection not successful', err);
    }
});
mongoose.Promise = global.Promise;


// Middlewares
app.use(morgan("dev"));
app.use('/Uploads', express.static('Uploads'));
app.use('/Assets', express.static('Assets'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Type, Signature"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//
// app.set('view engine','ejs');
// app.use(express.static('public'));
// app.use('/', express.static(path.join(__dirname, 'public')));

// View Engine Setup
//app.set('views', path.join(__dirname, 'views'))


// Routes which should handle requests


app.use("/admin", adminRoutes);
app.use("/user",userRoutes);



// Default Route When nothing matches
app.use((req, res, next) => {
    const error = new Error("Not found :o :o");
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;