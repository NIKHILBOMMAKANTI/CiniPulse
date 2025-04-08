let bcrypt = require('bcrypt');


let Passwordhash = async(req,res,next)=>{
    try{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password,salt);
        req.hashed_password = hash;
        next();

    }catch(error){
        res.status(500).send(error.message);
    }
}
module.exports = Passwordhash;
