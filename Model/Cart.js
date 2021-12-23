const mongoose = require("mongoose");

const cartSSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    items: [new mongoose.Schema({
        product: {type: String}
    }, {strict: false})],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    amount:{type:Number},
},{timestamps:true},{strict:false});

module.exports = mongoose.model('Cart',cartSSchema);