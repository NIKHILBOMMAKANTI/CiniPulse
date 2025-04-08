let Express = require("express");
let router = Express.Router();
let verifyToken = require("../Middleware/Authentication/verifyToken");
let genreParser = require("../Middleware/Filehandling/genreParser.js");
let dotenv = require("dotenv").config();
let multer = require('multer');

let MovieManagemnt = require("../Controller/MovieManagemntController.js");
const { upload,S3} = require("../helper/AwsS3config.js");

//AddMovie
router.post("/addMovie",upload.fields([{name:"Image", maxCount: 1},{name:"Trailer",maxCount : 1 }]),verifyToken,genreParser,MovieManagemnt.addMovie);

// 
//Update Movie Based on Id
router.patch("/updateMovie",upload.fields([{name:"Image", maxCount: 1},{name:"Trailer",maxCount : 1 }]),verifyToken,genreParser,MovieManagemnt.updateMovie);

//Delete Movie Based on Id
router.delete("/deleteMovie", verifyToken, MovieManagemnt.deleteMovie);

//Retrive All movies
router.get("/retriveAllMovies",MovieManagemnt.retriveAllMovies);

//Retrive a Movie based upon the MovieId
router.get("/retrieveMovieById", MovieManagemnt.retrieveMovieById);

//Retrive a Movie based upon the genere
router.get("/similarMovies", MovieManagemnt.similarMovies);

//Search a movie based upon the movie and genere
router.get("/search",MovieManagemnt.search);

//Pagination functionality
// router.get("/paginated",MovieManagemnt.pagination);

module.exports = router;
