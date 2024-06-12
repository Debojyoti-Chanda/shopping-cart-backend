const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

//import router
const userRouter = require("./routers/user.routers");
const authRouter = require("./routers/auth.routers");

app.use(cors());

dotenv.config(); //This will load the variables from your .env file into process.env

// Body parser middleware
app.use(bodyParser.json());


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("MongoDB connected");
  })
    .catch((err) => console.log(err));
  
//routes
app.use("/user", userRouter);
app.use("/auth", authRouter);


//App listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});