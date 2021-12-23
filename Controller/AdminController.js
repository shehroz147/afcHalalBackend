const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");

// Models
const User = require("../Model/User");
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
    bcrypt.compare(request.password, admin.password, (err, result) => {
        if (err) {
            return res.status(400).json("Wrong Password");
        }
        if (result) {
            const token = jwt.sign(
                {
                    email: request.email,
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
    let user = await UserHelper.createAdmin(request.email.toLowerCase(), password,'admin');
    return res.status(200).json("Admin successfully created");
};

exports.addProduct = async(req,res,next)=>{
    let request = req.body;
    if(!(request.name && request.category && request.price &&request.picture )){
            return res.status(400).json("Missing credentials");
    }
       let result = await ProductHelper.addProduct(request.name,request.category,request.price,request.picture);
        return res.status(200).json("Product successfully added");
};

exports.editProduct = async (req, res, next) =>{

    let request = req.body;
    if (!request._id){
        return res.status(400).json("Missing Product Id");
    }
    let findProduct = await Product.findById({_id:request._id});
    if (findProduct === null) {
        return res.status(400).json("Missing Product");
    }
    let result = await ProductHelper.updatingProduct(findProduct, request, res);
    return res.status(200).json("Product Updated");
};

exports.deleteProducts = async (req, res, next) => {
    let request = req.body;
    let result="";
    const productId = request._id;
    await Product.deleteOne({_id:productId}).exec().then(docs => {
        result = docs;
    })
.catch(err => {
        res.status(500).json({
            error: err
        });
    });
    return res.status(200).json("Product Deleted");
};
// export const deleteProduct = async (req, res, next) => {
//     try {
//         const productId = req.params.id;
//
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product don't found" });
//         }
//
//         const deletedProduct = await Product.findOneAndDelete({ _id: productId });
//
//         deleteFile(product.imageUrl);
//
//         res.status(200).json({ message: "product Deleted Successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong deleteProduct" });
//         console.log(e);
//     }
// };
// export const getAllOrders = async (req, res, next) => {
//     try {
//         let orders = await Order.find({ }).sort({"createdAt":-1})
//             //  const test =   orders.map((x)=>{
//             //    console.log(x.total)
//             //       x.products?.map((x)=>{
//
//             //        const id = x._id
//             //       x['test'] = 'test'
//             //       console.log(x)
//
//
//             //       })
//             //     })
//             // .sort({ createdAt: -1 })
//             //  .populate("productId");
//
//
//
//             .populate(
//                 'products.productId',
//
//
//             ).
//             populate('userId')
//
//
//         console.log(orders)
//
//         res.status(200).json({ data: orders });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong getting All Orders" });
//         console.log(e);
//     }
// };
//
// export const orderStatus = async (req, res, next) => {
//     try {
//         const order = await Order.findById({
//             _id: req.params.id,
//         });
//         if (!order) {
//             return res.status(200).json({ message: "Order Don't find" });
//         }
//
//         order.status = req.body.status;
//
//         await order.save();
//         res.status(200).json({ message: "order status edited successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(e);
//     }
// };
//
// export const deleteOrder = async (req, res, next) => {
//     try {
//         const order = await Order.findById({ _id: req.params.id });
//         order.delete = 1;
//         await order.save();
//         if (!order) {
//             return res.status(200).json({ message: "no such order exist" });
//         }
//         res.status(200).json({ message: "order deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(err);
//     }
// };