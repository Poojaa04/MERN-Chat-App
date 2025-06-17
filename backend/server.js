const express = require("express");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes  = require ("./routes/messageRoutes.js");
const {notFound, errorHandler} = require("./middlewares/errorMiddleware")
const dotenv = require("dotenv");

const app= express();
app.use(express.json());

dotenv.config();

app.get('/',(req,res)=>{
    res.send("API is called!")
});

connectDB();

app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000,()=>{console.log('Server running at PORT:5000')});

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
     origin:'http://localhost:3000'
    },
});

io.on("connection",(client)=>{
    console.log("Connection established");

    client.on("setup",(userdata)=>{
       client.join(userdata._id);
       client.emit("Connected");
    });


    client.on("join room",(room)=>{
    client.join(room);
    console.log('joined to room' + room);
});

client.on("typing",(room)=>{
   client.in(room).emit("typing");
});

client.on("stop typing",(room)=>{
    client.in(room).emit("stopped typing")
});

client.on("new message",(messageRecieved)=>{
let chat = messageRecieved.chat;
if(!chat.users) return console.log("chat.users not found");

chat.users.forEach((user)=>{
if(user._id == messageRecieved.sender._id) return;
client.in(user._id).emit("new message recieved",messageRecieved)
});
});

client.off("setup",()=>{
    console.log("disconnected");
    client.leave(userdata._id);
});

});

