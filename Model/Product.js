const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    category: {type: String, required:true},
    productImage: {type: String, default: "default.jpg"},
    price:{type:Number,required:true},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);
