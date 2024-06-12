const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [CartItemSchema],
    totalCost: {
        type: Number,
        required: true,
        default: 0
    }
});
module.exports = mongoose.model("Cart", CartSchema);