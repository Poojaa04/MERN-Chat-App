const express = require("express");
const {sendMessage, allMessages} = require("../controllers/messageControllers");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/",protect,sendMessage);
router.get("/:chatId",protect,allMessages);

module.exports = router;