const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.postSignup = (req, res, next) => {         // Done 
  const { u_id, u_name, u_pwd, u_email, u_addr, u_contact } = req.body;

  // Check if the user already exists
  User.findOne({ u_email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      return bcrypt
        .genSalt(10)
        .then((salt) => {
          return bcrypt.hash(u_pwd, salt);
        })
        .then((hashedPassword) => {
          // Create a new user
          const newUser = new User({
            u_id,
            u_name,
            u_pwd: hashedPassword,
            u_email,
            u_addr,
            u_contact,
          });

          // Save the user to the database
          return newUser.save();
        })
        .then((savedUser) => {
          // Generate JWT token
          const token = jwt.sign({ u_id: savedUser._id }, process.env.JWT_SECRET, {   // payload added here
            expiresIn: "1h",
          });

          // Return user details (excluding the password) and token
          res.status(201).json({
            user: {
              u_id: savedUser.u_id,
              u_name: savedUser.u_name,
              u_email: savedUser.u_email,
              u_addr: savedUser.u_addr,
              u_contact: savedUser.u_contact,
            },
            token,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error: error.message });
    });
};

module.exports.postLogin = (req, res, next) => {  // Done 
  const { u_name, u_pwd } = req.body;

  // Find the user by username
  User.findOne({ u_name })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Compare the hashed password
      bcrypt
        .compare(u_pwd, user.u_pwd)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
          }

          // Generate JWT token
          const token = jwt.sign({ u_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          // Return user details (excluding the password) and token
          res.status(200).json({
            user: {
              u_id: user.u_id,
              u_name: user.u_name,
              u_email: user.u_email,
              u_addr: user.u_addr,
              u_contact: user.u_contact,
            },
            token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Error comparing passwords",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error: error.message });
    });
};

module.exports.getLogout = (req, res, next) => {   // done
  try {
    res.status(200).json({ message: "User Logged Out" });
  } catch (err) {
    res.status(400).json({ message: "Token not provided" });
  }
};

//from the front end session storage token is removed
