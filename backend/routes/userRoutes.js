const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {registerUser, authUser, allUsers} = require("../controllers/userControllers");

const router = express.Router();

router.route("/").get(registerUser).post(protect, allUsers);
router.route("login").post(authUser);

module.exports = router;