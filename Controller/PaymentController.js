const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");

// Models
const User = require("../Model/User");
const Product = require("../Model/Product");
const Card = require("../Model/Card");

// Constants

// Helpers
const UserHelper = require("../Helper/UserHelper");
const ProductHelper = require("../Helper/ProductHelper");
const PaymentHelper = require("../Helper/PaymentHelper");

exports.paymentCheck = async(req,res,next)=>{
    let request = req.body;
    const PSPID = request.PSPID;
    const ORDERID = request.ORDERID;
    const AMOUNT = request.AMOUNT;
    const CURRENCY = request.CURRENCY;
    const LANGUAGE = request.LANGUAGE;
    const CN = request.CN;
    const EMAIL = request.EMAIL;

    let result = await PaymentHelper.paymentCheck(PSPID,ORDERID,AMOUNT,CURRENCY,LANGUAGE,CN,EMAIL);
}
