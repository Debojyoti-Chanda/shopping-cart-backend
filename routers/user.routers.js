const express = require("express");

//controller 
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.get("/get-products", userController.getProducts);

router.get("/addToCart/:productId", verifyToken, userController.addToCart);

router.get("/removeFromCart/:productId", verifyToken, userController.removeFromCart);

router.get("/getCart", verifyToken, userController.getCarts);

// router.get("/buyNow",verifyToken, userController.buyNow);



module.exports = router;