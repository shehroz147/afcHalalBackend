

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");

// Models
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
// Constants

// Helpers
const UserHelper = require("../Helper/UserHelper");
const ProductHelper = require("../Helper/ProductHelper");

exports.login = async (req, res, next) => {
    let request = req.body;
    if (!(request.email && request.password)) {
        return res.status(400).json("Missing Email or Password");
    }
    let admin = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (admin == null) {
        return res.status(400).json("Email does not exist");
    }
    console.log(admin);
    bcrypt.compare(request.password, admin.password, (err, result) => {
        if (err) {
            return res.status(400).json("Wrong Password");
        }
        if (result) {
            const token = jwt.sign(
                {
                    email: request.email,
                    _id:admin._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "12h"
                });

            let result = {
                email: request.email,
                profileImage: admin.profileImage,
                token:token
            }
            // Only For Login API
            return res.status(200).json("Logged in as Admin",result);
        }
    });
    return res.status(400).json("Something went wrong");
}

exports.signup = async (req, res, next) => {
    //Signup function to add a new user  when the user provides required info
    let request = req.body;
    //checking required info
    if (!request.email || !request.password) {
        return res.status(400).json("Missing Email or Password");
    }
    //checking if the email entered by user already exists or not
    let modelUser = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (!(modelUser == null)) {
        return res.status(400).json("User already exist with this email");
    }
    let password = await UserHelper.bcryptPassword(request.password);
    //adding user to database
    let user = await UserHelper.createUser(request.email.toLowerCase(), password,'user');
    return res.status(200).json("User successfully created");
};

exports.getProducts = async(req,res)=>{
    let request = req.body;
    let findProducts = await ProductHelper.getProducts();
    if(findProducts==null){
        return res.status(400).json("No Products");
    }
    return res.status(200).json(findProducts);
}

// exports.addProductToCart = async (req, res, next) => {
//     let request = req.body;
//     const product = await Product.find(request.name);
//
//     exports.addFriend = async (user, friend, res) => {
//         return User.updateOne(user, { $push: { friends: { friend } } });
//     }
//
// };
// export const forgetPassword = async (req, res, next) => {
//     try {
//         const token = randomstring.generate({ length: 5, charset: "numeric" });
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({ message: "no user with this email found" });
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         await user.save();
//         forgetPasswordEamil({ token, to: req.body.email });
//         res
//             .status(200)
//             .json({ token,message: "An email has been sent to your email account" });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong in forget password" });
//         console.log(e);
//     }
// };
//
// export const setPasswordAfterforget = async (req, res, next) => {
//     try {
//         const password = req.body.password;
//         // const userId = req.userId;
//         const passwordToken = req.body.passwordToken;
//         let resetUser;
//
//         const user = await User.findOne({
//             email: req.body.email,
//             resetToken: passwordToken,
//             resetTokenExpiration: { $gt: Date.now() },
//         });
//
//         if (!user) {
//             return res.status(400).json({ message: "You are seems to be spam" });
//         }
//         resetUser = user;
//         const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//
//         resetUser.password = hashedPassword;
//         resetUser.resetToken = undefined;
//         resetUser.resetTokenExpiration = undefined;
//         await resetUser.save();
//
//         res.status(200).json({ message: "your password is successfully changed" });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong in setPasswordAfterforget" });
//         console.log(e);
//     }
// };

