const mongoose = require("mongoose");

const connectDB = async () =>{
try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('database connected!');
}
catch(error){
 console.log(`Error found ${error.message}`);
 process.exit();
}
};

module.exports = connectDB;