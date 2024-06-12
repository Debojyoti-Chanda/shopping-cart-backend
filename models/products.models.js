const mongoose = require('mongoose');
// Define a schema and model for products
const productSchema = new mongoose.Schema({
    p_id: Number,
    p_name: String,
    p_cost: Number,
    p_cat: String,
    p_desc: String,
    p_image: String, // Add p_image field
});
  
module.exports = mongoose.model("products", productSchema);


//Done 