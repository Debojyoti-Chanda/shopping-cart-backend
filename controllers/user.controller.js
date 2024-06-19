const userModel = require("../models/user.models");
const productsModel = require("../models/products.models");
const cartModel = require("../models/cart.models");

module.exports.getProducts = (req, res, next) => {
  // done
  productsModel
    .find({})
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      console.log("Error to fetch the data");
    });
};

module.exports.getCarts = (req, res, next) => {
  const userId = req.userId;
  cartModel
    .findOne({ user: userId })
    .then((updatedCart) => {
      return cartModel.findById(updatedCart._id).populate('items.productId').exec();
    })
    .then((populatedCart) => {
      res
        .status(200)
        .json({ message: "Product added to cart", cart: populatedCart });
    })
    .catch((err) => {
      console.log("Error to fetch the data");
    });
};

module.exports.addToCart = (req, res, next) => {
  // const productId = req.params.productId;
  // const userId = req.userId; // from verifyUser.js

  const productId = req.params.productId;
  // console.log(productId + "   productId");
  const userId = req.userId; // Assuming the user ID is stored in req.user
  // console.log(req.userId + "    userId");
  // Find the product by ID to get its price
  productsModel.findById({ _id: productId }).then((product) => {
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // console.log(product);
    // Find the cart for the user or create a new one
    cartModel
      .findOne({ user: userId })
      .then((cart) => {
        // console.log(cart + "   cart val");
        if (!cart) {
          // If no cart exists, create a new one
          cart = new cartModel({ user: userId, items: [], totalCost: 0 });
        }

        // Check if the product is already in the cart
        const existingCartItem = cart.items.find((item) =>
          item.productId.equals(productId)
        );

        if (existingCartItem) {
          // If the product is already in the cart, increment the quantity
          existingCartItem.quantity += 1;
        } else {
          // If the product is not in the cart, add a new item
          cart.items.push({ productId, quantity: 1 });
        }

        // Update the total cost
        cart.totalCost += product.p_cost;

        // Save the updated cart
        return cart.save();
      })
      .then((updatedCart) => {
        return cartModel.findById(updatedCart._id).populate('items.productId').exec();
      })
      .then((populatedCart) => {
        res
          .status(200)
          .json({ message: "Product added to cart", cart: populatedCart });
      })
      .catch((error) => {
        res.status(500).json({ message: "Server error", error: error.message });
      });
  });
};

module.exports.removeFromCart = (req, res, next) => {
  const productId = req.params.productId;
  console.log(productId + "   productId");
  const userId = req.userId; // Assuming the user ID is stored in req.user
  console.log(req.userId + "    userId");

  // Find the cart for the user
  cartModel
    .findOne({ user: userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Find the item in the cart
      const cartItemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );

      if (cartItemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Get the product price to update the total cost
      productsModel
        .findById({ _id: productId })
        .then((product) => {
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }

          // Update the total cost
          const cartItem = cart.items[cartItemIndex];
          cart.totalCost -= cartItem.quantity * product.p_cost;

          // Remove the item from the cart
          cart.items.splice(cartItemIndex, 1);

          // Save the updated cart
          return cart.save();
        })
        .then((updatedCart) => {
          res
            .status(200)
            .json({ message: "Product removed from cart", cart: updatedCart });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error: error.message });
    });
};

module.exports.buyNow = (req, res, next) => {
  const userId = req.userId;
};
