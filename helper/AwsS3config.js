const multer = require('multer');
const {S3Client} = require('@aws-sdk/client-s3')
require('dotenv').config();

const fileFilter = (req,file,cb)=>{

    if(file.fieldname == 'Image'){
        if(!file.mimetype.startsWith("image/")){
            cb(new Error(JSON.stringify({
                Field: "Image",
                message: "Invalid File Format"
            })),false)
        }else{
            cb(null,true)
        }
    }else if(file.fieldname == 'Trailer'){
        if(!file.mimetype.startsWith("video/")){
            cb(new Error(JSON.stringify(
                {
                Field: "Trailer",
                message: "Invalid File Format"
            })),false)
        }else{
            cb(null,true)
        }
    }
}
const upload = multer({
    storage:multer.memoryStorage(),
    fileFilter:fileFilter
});

const S3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

module.exports = {upload,S3}