let mongoose = require('mongoose');
let MovieSchema = mongoose.Schema({
    title: {type:String ,required:true},
    director:{type:String,required:true},
    genere: {type:[String],required:true},
    image_S3key: {type:String,required:true},
    trailer_S3key: {type:String,required:true},
    releaseDate : {type:String,required:true},
    description: {type:String,required:true},
    createdAt: {type:Date,default:Date.now},
    updatedAt: {type:Date,default:Date.now}
})
module.exports = mongoose.model("movies",MovieSchema);