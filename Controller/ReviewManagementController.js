const Review = require("../models/ReviewSchema");
const User = require("../models/UserSchema.js");

const mongoose = require("mongoose");
const moment = require('moment');

//Add review based upon the movieid
const addReview = async (req, res) => {
  try {
    const { content,rating } = req.body;
    if (req.user_data.role != "User") {
      return res.json({
        message: "Permission Denied: Only Users can perform this action.",
      });
    }
    const newreview = await new Review({
      movieid: new mongoose.Types.ObjectId(req.query["movie-id"]),
      userid: new mongoose.Types.ObjectId(req.user_data._id),
      content: content,
      rating:rating
    });
    await newreview.save();
    const { ...data } = newreview;
    const { createdAt, updatedAt, __v, ...review } = data._doc;

    return res.json({
      message: "Review Added Successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Update review based upon the reviewid
const updateReview = async (req, res) => {
  try {
    const { id, content } = req.body;
    if (req.user_data.role != "User") {
      return res.status(403).json({
        message: "Permission Denied: Only Users can perform this action.",
      });
    }
    const updateReview = await Review.findByIdAndUpdate(
      id,
      {
        content: content,
      },
      { new: true }
    );

    if (!updateReview) {
      return res.status(404).json({ message: "Review Not Found" });
    }

    return res.status(200).json({
      message: "Review Updated Successfully",
      data: updateReview,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Delete a review based upon the Reviewid
const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    if (req.user_data.role != "User") {
      return res.status(403).json({
        message: "Permission Denied: Only Users can perform this action.",
      });
    }
    const deletedData = await Review.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(500).json({ message: "Review Does not Exists" });
    }
    res
      .status(200)
      .json({ message: "Deleted Successfully", data: deletedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Retrive all the comments based upon the movieid
const retriveAllReviews = async (req, res) => {
  try {
    if (req.user_data.role != "User") {
      return res.status(403).json({
        message: "Permission Denied: Only Users can perform this action.",
      });
    }
    id = req.query['movie-id']
    const reviews_data = await Review.find({movieid:id}).lean();
    // console.log(reviews_data);
    if (reviews_data) {
      const Reviews = await Promise.all(
        reviews_data.map(async (review) => {
          const userid = review.userid.toString();

          const movies_data = await Review.find({movieid:id});
          const user_data = await User.findById(userid);
          const username = await user_data.username;
          const Timestamp = await review.createdAt;
          const createdAt = await moment(Timestamp).format('MMMM DD YYYY')
          const editable = (req.user_data._id == userid)?true:false

          // console.log(req.user_data._id,"Userdata");
          console.log(editable);

         
          return {
            ...review,
            username,
            createdAt,
            editable
          };
        })
      );
      
      res.json({ data: Reviews });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { addReview, updateReview, deleteReview, retriveAllReviews };
