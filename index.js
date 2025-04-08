let Express = require('express');
require('dotenv').config();
let Cors = require('cors')
let port = process.env.PORT;
let Dbconnect = require('./Config/MongoDBconnection');
let app = Express();
Dbconnect();

//Import Statements
let UserAuthentication = require('./Routes/UserAuthenticationRoute.js');
let MovieManagemnt = require('./Routes/MovieManagemntRoute.js');
let ReviewManagement = require('./Routes/ReviewManagementRoute.js')
let RatingSystem = require('./Routes/RatingSystemRoute.js')

//Middleware
app.use(Express.json());
app.use(Cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use("/auth", UserAuthentication);
app.use("/movies", MovieManagemnt);
app.use("/review", ReviewManagement);
app.use("/rating",RatingSystem);

app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server is Runing...")
    }
})
