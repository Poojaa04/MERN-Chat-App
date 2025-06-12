const asynchandler  = require("express-async-handler");
const User  = require("../models/userModel");
const {generateToken} = require("../config/generateToken");

const registeruser = asynchandler(async(req,res)=>{
    //Check is all details are entered
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password ) {
        res.status(400);
        throw new Error("Please enter all credentials");
    }
    //Check is user exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists! Please login.");
    }
    //create user if does not exist
    const user = await User.create(
        { name, email, password, pic}
    );
    if(user){
        res.status(201).json({
            _id : user._id,
            name:user.name,
            password : user.password,
            pic : user.pic,
            token : generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Sign up failed! Please try again");
    };

})

//user authentication during login
const authuser = asynchandler(async(req,res)=>{
    const{email,password} = req.body;
    const user = User.findOne({email});
    if(user && (await user.matchpassword(password))){
        res.json(
            {
                _id :user._id,
                name : user.name,
                email : user.email,
                pic : user.pic,
                token : generateToken(user._id)
            }
        );
    }else{
        res.status(400);
        throw new Error("Email or Password is incorrect");
    };
});

//Searching users based on query string