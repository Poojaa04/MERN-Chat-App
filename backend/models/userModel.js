const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        pic:{ type:String, required:true, default: "https://freesvg.org/img/abstract-user-flat-4.png"},
    },
    {timestamps:true}
);

//This is a method
userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

//This is a middleware
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User",userSchema);

module.exports = User;

