const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: {type: String, index: true},
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String]
});

const productModel = model('products', schema)

module.exports = productModel;