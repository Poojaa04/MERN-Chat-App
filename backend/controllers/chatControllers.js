const asynchandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asynchandler(async(req,res)=>{
    const {userID} = req.body;
    if(!userID){
        console.log("User Id not sent");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and:[
              {users:{$elemMatch:{$eq:req.user._id}}},
              {users:{$elemMatch:{$eq:userId}}}
        ]
        })
        .populate("users","-password")
        .populate("latestMessage");

        isChat = await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"name email pic"
        });

        if(isChat.length >0){
            res.send(isChat[0]);
        }else{
         let chatData = {
            chatName : "sender",
            isGroupChat : false,
            users:[req.user._id,userId]
         }
         try{
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id:createChat._id}).populate("users,-password");
            res.status(200).send(fullChat);
         }catch(error){
            res.status(400);
            throw new Error(error.message);
         }
        }
})