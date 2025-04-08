let mongoose = require('mongoose');
let ReviewSchema = mongoose.Schema({
    movieid:{type:mongoose.Types.ObjectId,required:true},
    userid:{type:mongoose.Types.ObjectId ,required:true},
    content:{type:String,required:true},
    rating:{type:Number,min:1,max:5},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
});
module.exports = mongoose.model("review",ReviewSchema);