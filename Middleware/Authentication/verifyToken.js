const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//models
const User = require("../../models/UserSchema");

    const verifyToken = async (req,res,next)=>{
        if(!req.headers['authorization']){
            res.status(400).json({msg:"Invalid or Expired Token"});
        }
        try{
            if(req.headers['authorization']){
                const unfilteredToken = req.headers['authorization'];
                const Token = unfilteredToken.split(" ")[1];
                const decoded_data = await jwt.verify(Token,process.env.JWT_SECRET_KEY)
                const user = await User.findById(decoded_data._id);
                if(user){
                    req.user_data = user
                    next();
                }else{
                    res.status(404).json({
                        message:"User does Not Exist"
                    });
                } 
            }
        }catch(error){
            res.status(400).json({msg:error.message});
        }
    }
module.exports = verifyToken;