// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     avatar: {
//       trype: String,
//       required: true,
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// const UserModel = mongoose.model("user", userSchema);

// module.exports = {
//   UserModel,
// };

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true 
    },
    email: {
      type: String,
      required: true,
      unique: true 
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};

/* 
  {
    "fullName": "pandu kumar",
    "userName": "pandu",
    "email": "pandu@gmail.com",
    "password": "1234",
    "avatar": "http://image.com"
  }
*/
