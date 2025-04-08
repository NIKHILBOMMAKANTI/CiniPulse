let Express = require("express");
let router = Express.Router();

let verifyToken = require("../Middleware/Authentication/verifyToken.js");

//Controller
let Ratingsystem = require('../Controller/RatingSystemController.js')

//AddRating
router.patch("/addRating", verifyToken, Ratingsystem.addRating);

router.get("/avgRating",Ratingsystem.avgRating);

module.exports = router;
