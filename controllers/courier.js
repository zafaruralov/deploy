/* eslint-disable no-unused-vars */
const Products = require('../models/products')
const ITEM_PER_PAGE = 5
const courierController = {
    getAll: async (req,res,next) => {
        try {
            const page = +req.query.page || 1
            let totalItem;
            Products.find({ status : "couriering" })
            .populate('categoryId')
            .countDocuments().then(numProducts => {
                totalItem = numProducts
                return Products.find({ status : "couriering"})
                .skip((page -1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
            }).then(product => {
                res.status(200).json(product)})
        } catch (error) {
            next(error)
        }
    },
    getOne: (req,res,next) => {
        const productId = req.params.id
        Products.findById(productId).populate('categoryId').then(product => {
        res.status(200).json(product)
        }).catch(err => next(err))
    },
    updateCourier: (req,res,next) => {
        const status = req.body.status
        const productId = req.params.id
        Products.findById(productId).then(product => {
            product.status = status
            return product.save();
        }).then(product => {
            res.status(200).json(product)
        }).catch(err => next(err))
    }
}

module.exports = courierController