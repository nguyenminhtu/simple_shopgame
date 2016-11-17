var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    products: [{
        product_title: {type: String},
        product_image: {type: String},
        product_price: {type: Number},
        product_description: {type: String}
    }]
});

module.exports = mongoose.model('Category', categorySchema);
