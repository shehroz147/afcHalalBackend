const moment = require("moment");
const express = require("express");
const bcrypt = require("bcryptjs");
// Mongoose
const mongoose = require("mongoose");

const Card = require("../Model/Card");

exports.paymentCheck = async(pspId,orderId,amount,currency,lang,cn,email)=>{
    const card = new Card({
        _id:new mongoose.Types.ObjectId(),
        pspId:pspId,
        orderId:orderId,
        amount:amount,
        currency:currency,
        language:lang,
        cn:cn,
        email:email
    });
    return await card.save();
}