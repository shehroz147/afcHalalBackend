const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    amount:{type:Number,required:true},
    currency:{type:Number,required: true},
    language:{type:String},
    orderId:{type:String,required:true},
    pspId:{type:String},
    email:{type:String},
    cn:{type:String}

},{timestamps:true});

module.exports = mongoose.model('Card', cardSchema);