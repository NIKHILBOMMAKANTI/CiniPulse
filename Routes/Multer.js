let Express = require('express');
let app = Express();
let multer = require('multer');
let path = __dirname + '/MovieManagement'
let Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path);
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname);
    }
});
let upload = multer({
    storage:Storage
})
app.get("/",upload.single("file"),(req,res)=>{
    console.log(req.file);
    res.json({
        data:req.file
    })
})
app.listen(3100,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("Server is Runing...")
    }
})
