let Express = require("express");
let router = Express.Router();


let verifyToken = require("../Middleware/Authentication/verifyToken");
const {reviewvalidator} = require('../validators/formvalidations.js')


//Controller
let ReviewManagement = require('../Controller/ReviewManagementController.js')

router.post("/addReview", verifyToken, reviewvalidator, ReviewManagement.addReview);
router.patch("/updateReview",verifyToken ,ReviewManagement.updateReview);
router.delete("/deleteReview", verifyToken, ReviewManagement.deleteReview);
router.get("/retriveAllReviews", verifyToken,ReviewManagement.retriveAllReviews);

module.exports = router;
