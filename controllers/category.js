/* eslint-disable no-unused-vars */
const Category = require('../models/category')

const categoryController = {
    getAll: (req,res,next) => {
        Category.find().then(category => {
            res.status(200).json(category)
        }).catch(err => next(err))
    },
    createCategory: (req,res,next) => {
        const name = req.body.name
        const category = new Category({
            name:name
        })
        category.save().then((result) => {res.status(201).json(result)})
        .catch(err => next(err))
    },
    getOne: (req,res,next) => {
        const categoryId = req.params.id;
        Category.findById(categoryId).then(category => {
            res.status(200).json(category)
        }).catch(err => next(err))
    }
}
module.exports = categoryController