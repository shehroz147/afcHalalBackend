const moment = require("moment");
const express = require("express");
const bcrypt = require("bcryptjs");
// Mongoose
const mongoose = require("mongoose");
const Product = require("../Model/Product");


exports.addProduct = async(_name,_category,_price,image)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: _name,
        price: _price,
        category: _category,
        productImage:image
    });
    return await product.save();
}

exports.updatingProduct = async (product_, request, res) => {

    let result = "";

    const updateProduct = {
        name: request.name || product_.fullName,
        category: request.category || product_.category,
        image: request.image || product_.image,
        price: request.price || product_.price,
        };

    await Product.updateOne({ _id: request._id }, { $set: updateProduct })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    return result;
}

exports.getProducts = async()=>{
    let products = [];
        products = await Product.find({ isDeleted: false}, {
            name: 1,
            category: 1,
            price: 1,
            productImage: 1,
            _id: 0
        });
        return products;
}
