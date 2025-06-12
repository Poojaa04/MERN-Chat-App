const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {registerUser, authUser} = require("../controllers/userControllers");

const router = express.Router();

router.route("/").get(registerUser).post(protect);
router.route("login").post(authUser);

module.exports = router;