const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    status: {type: String, required: true},
    amount: {type:Number,required:true},
},    {timestamps: true});
module.exports = mongoose.model('Order', orderSchema);

