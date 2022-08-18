const Products = require('../models/products')
const searchController = {
    getAll: (req,res,next) => {
        const { name } = req.query;
        Products.find({name: { $regex: name}}).populate('categoryId').then(product => {
            res.status(200).json(product)
        }).catch(err => next(err))
    }
}
module.exports = searchController