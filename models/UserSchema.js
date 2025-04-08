let mongoose = require('mongoose')
let UserSchema = new mongoose.Schema({
    username: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    password:{type:String,required:true},
    role: {type:String,required:true,default:"User", enum:["User","Admin"]},
    createdAt: {type:Date, default:Date.now},

})
module.exports = mongoose.model("users",UserSchema);