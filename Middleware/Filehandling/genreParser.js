const genreParser = (req,res,next)=>{
    const parseddata = req.body.genere
    const genere = parseddata.split(",");
    req.body.genere = genere;
    
    next();
}

module.exports = genreParser;