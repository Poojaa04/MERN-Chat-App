const User = require("../models/userModel")
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const protect = asynchandler(async(req, res,next)=>{
    let token;
    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
             token = req.headers.authorization.split(" ")[1];
             const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
             req.user = await User.findById(decoded.id).select("-password"); 
             next();
        }catch{
            res.status(401);
            throw new Error("user suthentication failed!!");
        }
      }

      if(!token){
          res.status(401);
          throw new Error("user suthentication failed!!");
      }
});

module.exports = {protect};