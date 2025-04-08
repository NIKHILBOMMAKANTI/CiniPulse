const Express = require("express");
const router = Express.Router();

const verifyToken = require("../Middleware/Authentication/verifyToken");
const Passwordhash = require("../Middleware/Authentication/Passwordhash");


const UserAuthentication = require('../Controller/UserAuthenticationController.js');
const formvalidator = require('../validators/formvalidations.js')

//Register Api
router.post("/register", formvalidator.registerValidator,Passwordhash,UserAuthentication.register);

//Login Api
router.post("/login",formvalidator.loginValidator,UserAuthentication.login);

//RoleBasedAccess Api
router.get("/roleBasedAccess", verifyToken, UserAuthentication.roleBasedAccess);

module.exports = router;
