const mongoose = require('mongoose')
//create  user schema
const usersSchema = new mongoose.Schema({
    u_id: Number,
    u_name: String,
    u_pwd: String,
    u_email: String,
    u_addr : String,
    u_contact : String
})
module.exports = mongoose.model("users", usersSchema)