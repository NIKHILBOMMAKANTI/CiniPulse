//Scehama
let Movie = require("../models/MovieSchema");
const Review = require("../models/ReviewSchema");
let { upload, S3 } = require("../helper/AwsS3config");
let { S3Client } = require("@aws-sdk/client-s3");
let { PutObjectCommand,GetObjectCommand,DeleteObjectCommand} = require("@aws-sdk/client-s3");
let { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { findById } = require("../models/UserSchema");
require("dotenv").config();

//AddMovie
let addMovie = async (req, res) => {
  try {
    const { title, director, genere, releaseDate, description } = req.body;
    if (req.user_data.role != "Admin") {
      return res.json({
        message:
          "Permission Denied: Only administrators can perform this action.",
      });
    }

    if (
      !req.files["Image"] ||
      req.files["Image"].length === 0 ||
      !req.files["Trailer"] ||
      req.files["Trailer"].length == 0
    ) {
      return res.status(500).json({
        message: "No File Found",
      });
    }
    let movieExists = await Movie.exists({
      title: title,
    });

    if (movieExists) {
      return res.json({
        message: "Movie Already Exists",
      });
    }

    let imageS3key = `${"Images"}/${Date.now()} + ${
      req.files["Image"][0].originalname
    }`;
    let trailerS3key = `${"Trailers"}/${Date.now()} + ${
      req.files["Trailer"][0].originalname
    }`;

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
        ContentType: req.files["Image"][0].mimetype,
        Body: req.files["Image"][0].buffer,
      })
    );
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: trailerS3key,
        ContentType: req.files["Trailer"][0].mimetype,
        Body: req.files["Trailer"][0].buffer,
      })
    );

    let newmovie = await new Movie({
      title: title,
      director: director,
      genere: genere,
      image_S3key: imageS3key,
      trailer_S3key: trailerS3key,
      releaseDate: releaseDate,
      description: description,
    });
    await newmovie.save();

    let imagesignedurl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
      }),
      { expiresIn: 21600 }
    );
    let trailersignedurl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
      }),
      { expiresIn: 21600 }
    );

    return res.json({
      message: "Movie Added Successfully",
      image_presignedUrl: imagesignedurl,
      trailer_presignedUrl: trailersignedurl,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Update Movie Based on Id
let updateMovie = async (req, res) => {
  try {
    const {
      id,
      title,
      director,
      genere,
      image_S3key,
      trailer_S3key,
      releaseDate,
      description,
    } = req.body;
    if (req.user_data.role != "Admin") {
      return res.json({
        message:
          "Permission Denied: Only administrators can perform this action.",
      });
    }

    console.log(id);
    let movieRecord = await Movie.findById(id);
    console.log(movieRecord);

    let trailerS3key = movieRecord.trailer_S3key;
    let imageS3key = movieRecord.image_S3key;

    if (req.files && req.files["Image"] && req.files["Image"].length > 0) {
      //If Image Exists delete the old Multimedia from Aws
      let existingimage_S3key = movieRecord.image_S3key;
      await S3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: existingimage_S3key,
        })
      );

      //Add updated Multimedia to Aws
      imageS3key = `${"Images"}/${Date.now()}_${
        req.files["Image"][0].originalname
      }`;
      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageS3key,
          ContentType: req.files["Image"][0].mimetype,
          Body: req.files["Image"][0].buffer,
        })
      );
    }

    if (req.files && req.files["Trailer"] && req.files["Trailer"].length > 0) {
      //If Trailer Exists delete the old multimedia form Aws
      let existingtrailer_S3key = movieRecord.trailer_S3key;
      await S3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: existingtrailer_S3key,
        })
      );

      //Add new Multimedia to Aws
      trailerS3key = `${"Trailers"}/${Date.now()}_${
        req.files["Trailer"][0].originalname
      }`;
      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: trailerS3key,
          ContentType: req.files["Trailer"][0].mimetype,
          Body: req.files["Trailer"][0].buffer,
        })
      );
    }
    let UpdateMovie = await Movie.findByIdAndUpdate(
      id,
      {
        title: title,
        director: director,
        genere: genere,
        image_S3key: imageS3key,
        trailer_S3key: trailerS3key,
        releaseDate: releaseDate,
        description: description,
      },
      { new: true }
    );
    await UpdateMovie.save();

    if (!UpdateMovie) {
      return res.status(404).json({ message: "Movie Not Found" });
    }

    return res.json({
      message: "Movie Updated Successfully",
      data: UpdateMovie,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Delete Movie Based on Id
let deleteMovie = async (req, res) => {
  try {
    const { id } = req.body;
    if (req.user_data.role != "Admin") {
      return res.json({
        message:
          "Permission Denied: Only administrators can perform this action.",
      });
    }

    let movieRecord = await Movie.findById(id);
    //If id Does not Exists
    if (!movieRecord) {
      return res.status(404).json({ message: "Movie does not exist" });
    }
    const imageS3key = movieRecord.image_S3key;
    const trailerS3key = movieRecord.trailer_S3key;

    await S3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
      })
    );
    await S3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: trailerS3key,
      })
    );

    let deletedData = await Movie.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(500).json({ message: "Movie Does not Exists" });
    }
    return res.status(200).json({
      message: "Deleted Successfully",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Retrive All movies
let retriveAllMovies = async (req, res) => {
 try{
  console.log(req.query);
  const limit = req.query['limit'] || 12
  const offset = req.query['offset'] || 0
  let movies_data = await Movie.find().limit(limit).skip(offset).lean();
  console.log(movies_data);
  let data = await Promise.all(
    movies_data.map(async (Moviesdata) => {
      let imageS3key = Moviesdata.image_S3key;
      let trailerS3key = Moviesdata.trailer_S3key;
      

      // console.log(Moviesdata._id);
      const movies_data = await Review.find({movieid:Moviesdata._id});
      const totalRating = await movies_data.reduce((sum,movie)=>sum + movie.rating,0);
      const avg_rating = totalRating/movies_data.length;

      let slicedcontent = Moviesdata.description.slice(0,150) +" " +"..." ;
      console.log(slicedcontent);


      

      const S3 = new S3Client({ region: process.env.AWS_REGION });

      let Image_presignedUrl = await getSignedUrl(
        S3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageS3key,
        }),
        { expiresIn: 21600 }
      );
      let trailer_presignedUrl = await getSignedUrl(
        S3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: trailerS3key,
        }),
        { expiresIn: 21600 }
      );

      return {
        ...Moviesdata,
        avg_rating,
        Image_presignedUrl,
        trailer_presignedUrl,
        slicedcontent
      };
    })
  );

  return res.status(200).send({
    message: "Data Retrivied Successfully",
    data: data,
  });
 }catch(error){
  return res.status(500).json({ message: error.message });
 }

};

//Retrive Movie based upon the movie-id
const retrieveMovieById = async (req, res) => {
  try{
  const id = req.query["movie-id"];
  if (!id) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  let movies_data = await Movie.findById(id).lean();
  if (movies_data) {
    let imageS3key = movies_data.image_S3key;
    let trailerS3key = movies_data.trailer_S3key;

    const S3 = new S3Client({ region: process.env.AWS_REGION });

    const Image_presignedUrl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
      })
    );

    const trailer_presignedUrl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: trailerS3key,
      })
    );

    return res.json({
      ...movies_data,
      Image_presignedUrl,
      trailer_presignedUrl,
    });
  } else {
    res.status(404).json({
      message: "Movie Does not Exits",
    });
  }
}catch(error){
  return res.status(500).json({ message: error.message });
}
};

const similarMovies = async(req,res)=>{
  try{
  const id = req.query['movie-id'];
  const movies_data = await Movie.find({_id:id})
  genere = movies_data[0].genere
  const similarMovies = await Movie.find({genere:{$in:genere}}).limit(5).lean();
  const Moviesdata = await Promise.all(
     similarMovies.map(async (Movies) => {
    const imageS3key = Movies.image_S3key;
    const S3 = new S3Client({ region: process.env.AWS_REGION });
    let imagesignedurl = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageS3key,
      }),
      { expiresIn: 21600 }
    );
    
    return{
      imagesignedurl,
      ...Movies
    }
  
  }));
  res.status(200).json({data:Moviesdata})
  }catch(error){
    return res.status(500).json({ message: error.message });
  }
  
}

const search = async(req,res)=>{
  try{
  const search = req.query.filter
  const limit = req.query['limit'] || 12
  const offset = req.query['offset'] || 0
  data = await Movie.find({$or:[{title:{$regex:search,$options:"i"}},{genere:{$regex:search,$options:"i"}}]}).limit(limit).skip(offset).lean();
  movies_data = await Promise.all(
  data.map(async (Movies)=>{
    const imageS3key = Movies.image_S3key;
    const S3 = new S3Client({ region: process.env.AWS_REGION });
    let Image_presignedUrl = await getSignedUrl(S3,new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageS3key,
    }),{ expiresIn: 21600 });
    return{
      ...Movies,
      Image_presignedUrl
    }
  }));
  res.json({
    data:movies_data
  })
}catch(error){
  res.status(500).json({message: error.message })
}

}

module.exports = {addMovie,updateMovie,deleteMovie,retriveAllMovies,retrieveMovieById,similarMovies,search};
