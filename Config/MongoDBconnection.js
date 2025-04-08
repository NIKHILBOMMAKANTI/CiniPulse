require('dotenv').config();
let mongoose = require('mongoose');
let express = require('express');
// let connectionstring = 'mongodb://localhost:27017/movie_reviews';
let connectionstring = process.env.Mongouri
let Dbconnect = async ()=>{
    try{
        await mongoose.connect(connectionstring);
        console.log("Connected to MongoDb");
    }catch(error){
        console.log(error.message);
    }
    
}
module.exports = Dbconnect;

