// let {S3Client} = require('@aws-sdk/client-s3');
// let multer = require('multer');
// let multerS3 = require('multer-s3');
// require('dotenv').config();
// let Express = require('express');
// let app = Express();
//     let S3 = new S3Client({
//         region:process.env.AWS_REGION,
//         credentials:{
//             accessKeyId:process.env.AWS_ACCESS_KEY_ID,
//             secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
//         }
//     })
    
//     let upload = multer({
//         storage:multerS3({
//             s3:S3,
//             bucket:process.env.AWS_BUCKET_NAME,
//             key:(req,file,cb)=>{
//                 cb(null,Date.now()+file.originalname);
//             }
//         })
//     })
// const fileupload = upload.single();
// app.post("/upload",upload.single("file"),(req,res)=>{
//     console.log(req.file);
//     res.json({message:"File Uploaded Successfully"});
// })
// app.listen(3500,(err)=>{
//     if(err){
//         console.log(err.message);
//     }else{
//         console.log("Server is Runing...")
//     }
// })
//     // upload.single("file");
// module.exports = upload;
