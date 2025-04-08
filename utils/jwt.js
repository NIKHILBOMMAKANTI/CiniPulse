let jwt = require('jsonwebtoken');
require('dotenv').config();


function genereateToken(payload){ 
    Token = jwt.sign(payload , process.env.JWT_SECRET_KEY , {expiresIn:'6h'});
    return Token
}

module.exports = genereateToken;