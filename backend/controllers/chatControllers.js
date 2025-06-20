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
});

const fetchChats = asynchandler(async (req,res)=>{
try{
Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
.populate("users","-password")
.populate("groupAdmin","-password")
.populate("latestMessage")
.sort({updatedAt:-1})
.then(async(results)=>{
results = await User.populate(results,{
    path: "latestmessage.sender",
    select: "name email pic"
});
res.status(200).send(results);
})
}catch(error){
  res.status(400);
  throw new Error(error.message)
}
});

const createGroupChat = asynchandler(async(req,res)=>{
    if(!req.body.name || !req.body.users)
        res.status(400).send("Please select the users ");
    let users  = JSON.parse(req.body.users);
    if(users.length<2)
        res.status(400).send("more than 2 users are required!");
    users.push(req.user);
    try{
     const groupChat = await Chat.create({
        chatName: req.body.name,
        isGroupChat:true,
        users:req.users,
        groupAdmin:req.user
     });
     const accessGroupChat = await Chat.findOne({_id:groupChat._id})
     .populate("users","-password")
     .populate("groupAdmin","-password")  
     res.status(200).send(accessGroupChat);
    }catch(error){
       res.status(400)
       throw new Error(error.message);
    }
});

const renameGroup = asynchandler(async(req,res)=>{
    const {chatId,chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,{chatName},{new:true}
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!updatedChat) 
        return res.status(400).send("Couldn't update chat name")
    else 
    return res.status(200).json(updatedChat)
});

const addToGroup = asynchandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
       {$push:{users:userId}},
       {new:true}
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!added) 
        return res.status(400).send("Couldn't add to group")
    else 
    return res.status(200).json(added)
});

const removeFromGroup = asynchandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
       {$pull:{users:userId}},
       {new:true}
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!removed) 
        return res.status(400).send("Couldn't remove from group")
    else 
    return res.status(200).json(removed)
});

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup,removeFromGroup}