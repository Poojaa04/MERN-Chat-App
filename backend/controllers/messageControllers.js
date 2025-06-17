const asynchandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const sendMessage = asynchandler(async(req,res)=>{
 const {chatId,content} = req.body;
 if(!chatId || !content) {
    res.status(400).send("Provide all the details");
 }
 var newMessage = {
    sender : req.user._id,
    content : content,
    chat : chatId
 };
 try{
    var message = await Message.create(newMessage);
    message = await message.populate("sender","name pic");
    message = await message.populate("chat");
    message = await User.populate(message,{
        path:"chat.users",
        select:"name pic email"
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage : message
    })
    res.json(message);
 }catch(error){
    res.status(400);
    throw new Error(error.message);
 }
});

const allMessages = asynchandler(async(req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
        res.send(messages)
    }catch(error){
       res.status(400);
       throw new Error(error.message);
    }
})

module.exports = {sendMessage, allMessages}