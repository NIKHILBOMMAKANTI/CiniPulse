let Express = require('express');
let multer = require('multer');
let multerS3 = require('multer-s3');
let {S3Client} = require('@aws-sdk/client-s3');
let dotenv = require('dotenv').config();
let port = 3200;
let app = Express();
app.use(Express.json());

console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_BUCKET_NAME);
console.log(process.env.AWS_REGION);
let s3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    }
});
let upload = multer({
    storage:multerS3({
        bucket : process.env.AWS_BUCKET_NAME,
        s3: s3,
        key:(req,file,cb)=>{
            cb(null,file.originalname)
        }

    })
})
app.post("/upload",upload.single("file"),(req,res)=>{
    res.json({
        message : "File Uploaded to aws Successfully",
        url: req.file
    });
});
app.listen(port,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("Server is Runing...");
    }
})