const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        immutable : true,
        default: ()  => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status:{
        type: String,
        enum:['pending', 'processing', 'couriering','couriered','delivered','recieved'],
        default: "pending"
    }
});

module.exports = mongoose.model('Product', productSchema);