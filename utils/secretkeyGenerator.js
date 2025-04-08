let crypto = require('crypto');
function generateSecretKey(){
    let secretkey = crypto.randomBytes(23).toString('hex');
    return secretkey
}
module.exports = generateSecretKey;
