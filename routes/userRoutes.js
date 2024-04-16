require("dotenv").config();
const SECRET_CODE = process.env.SECRET_CODE;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/userModel.js");

const userRouter = express.Router();
const nodemailer = require('nodemailer');



userRouter.post("/register", async (req, res) => {
  try {
    const { fullName, userName, email, password, avatar } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      res.status(200).json({ msg: "User Already registered" });
    } else {
      bcrypt.hash(password, 5, (err, hash) => {
        if (!err) {
          const user = new UserModel({
            fullName,
            userName,
            email,
            password: hash,
            avatar,
          });
          user.save();
          res.status(200).json({ msg: "User added successfully" });
        } else {
          res.status(400).json({ msg: err });
        }
      });
    }
  } catch (err) {}
});
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "Please Register" });
    }
    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userID: user._id, username: user.username },
          SECRET_CODE,
          { expiresIn: "1h" }
        );
       
        const updatedUser = await UserModel.findOneAndUpdate(
          { email },
          { $set: { token: token } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(400).json({ msg: "Failed to update token" });
        }

        // const blacklist = new BlackListModel({ token });
        // await blacklist.save();
        res.status(200).json({ msg: "login successfull", token });
      } else {
        res.status(400).json({ msg: "wrong password"});
      }
    });
  } catch (err) {}
});

// userRouter.get("/logout", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (token) {
//       // Find and delete the token from the blacklist
//       // const deletedToken = await UserModel.findOneAndDelete({ token });


//       await UserModel.updateOne(
//         { email },
//         { $unset: { token: 1 } }
//       );


//       if (deletedToken) {
//         // Send a success message
//         return res.status(200).json({ msg: "You have been Logged out!" });
//       } else {
//         return res.status(404).json({ msg: "token not found in database" });
//       }
//     } else {
//       // If token is not provided in headers
//       return res.status(400).json({ msg: "token not provided" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
//-------------------------------------------------------------------------

userRouter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // 1. Find the user by token
      const user = await UserModel.findOne({ token });

      if (!user) {
        return res.status(404).json({ msg: "You are not registered" });
      }

      // 2. Unset the token field for the user
      await UserModel.updateOne(
        { _id: user._id },
        { $unset: { token: 1 } }
      );

      // 3. Send a success message
      return res.status(200).json({ msg: "You have been logged out!" });
    } else {
      // If token is not provided in headers
      return res.status(400).json({ msg: "Token not provided" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'corbin12@ethereal.email',
    pass: 'zFdaatK4F1FNHzdxhk'
  }
});
// Route for requesting a password reset
userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a reset token with expiry of 1 hour
    const resetToken = jwt.sign(
      { userID: user._id },
      SECRET_CODE,
      { expiresIn: "1h" }
    );

    // Send reset instructions to user's email
    const resetLink = `http://yourdomain.com/reset-password/${resetToken}`;

    // Example email template
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: user.email,
      subject: 'Password Reset Instructions',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: "Failed to send reset email" });
      }
      console.log('Reset email sent:', info.response);
      res.status(200).json({ msg: "Reset instructions sent to your email" });
    });

    // Update user document with reset token
    user.resetToken = resetToken;
    await user.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for resetting password with the provided token
// userRouter.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { password } = req.body;
//     const resetToken = req.params.token;

//     // Verify the reset token
//     jwt.verify(resetToken, SECRET_CODE, async (err, decoded) => {
//       if (err) {
//         return res.status(400).json({ msg: "Invalid or expired token" });
//       }

//       // Find user by decoded user ID
//       const user = await UserModel.findById(decoded.userID);

//       if (!user) {
//         return res.status(404).json({ msg: "User not found" });
//       }

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Update user's password and reset token
//       user.password = hashedPassword;
//       user.resetToken = null; // Clear the reset token
//       await user.save();

//       res.status(200).json({ msg: "Password reset successful" });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// userRouter.get("/change-password", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     const { newPassword } = req.body;

//     // Verify the token
//     const decoded = jwt.verify(token, SECRET_CODE);

//     // Find the user by the decoded userId
//     const user = await UserModel.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update the password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: "Password changed successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
//----------------------------------------------------------------

userRouter.patch("/update-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify current password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update User Profile
userRouter.patch('/update-profile', async (req, res) => {
  try {
    const { fullName, email, avatar, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user fields if provided
    if (fullName) {
      user.fullName = fullName;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    res.send("Profile updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating profile");
  }
});



module.exports = {
  userRouter,
};
