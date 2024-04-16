// you may use this mongoDB uri
// mongoURI=mongodb+srv://kumarS:kumar@cluster0.kfih6hj.mongodb.net/FLUIDAI?retryWrites=true&w=majority&appName=Cluster0
// PORT=8080
// SECRET_CODE=fluidai

// mongoURI=mongodb://127.0.0.1:27017/FLUIDAI
// PORT=8080
// SECRET_CODE=fluidai


const mongoose = require("mongoose");

require("dotenv").config();

const mongoURI = process.env.mongoURI;

const connection = mongoose.connect(mongoURI);

// const connection = mongoose.createConnection(mongoURI)

module.exports = {
  connection,
};
