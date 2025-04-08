const Review = require("../models/ReviewSchema");
// let Movie = require("../models/MovieSchema");

const addRating = async (req, res) => {
  try {
    if (req.user_data.role != "User") {
      return res.json({
        message: "Permission Denied: Only Users can perform this action.",
      });
    }
    const { id, rating } = req.body;
    const review = await Review.findById(id);
    console.log(review);
    if (review) {
      const newRating = await Review.findByIdAndUpdate(id, {
        rating: rating,
      });
      await newRating.save();
      res.status(200).json({
        message: "Rating Added Successfully",
        data: newRating,
      });
    } else {
      return res.status(500).json({ message: "Review Does not exits" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Based upon the Movieid get all the ratings and find average
const avgRating  = async(req,res)=>{
  try{
    const {id} = req.body;
    const movies_data = await Review.find({movieid:id});
    if (movies_data.length === 0) {
      return res.status(200).json({ avg_rating: 0 });
    }
    const totalRating = await movies_data.reduce((sum,movie)=>sum + movie.rating,0);
    const avg_rating = totalRating/movies_data.length;
    res.status(200).json({
      avg_rating
    })

  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
}
module.exports = { addRating,avgRating };
