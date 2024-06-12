const express = require("express");


//controller 
const authController = require("../controllers/auth.controller");
// const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;

//Done