const categoryController = require('../controllers/category.js')
const express = require('express');
const categoryRouter = express.Router()

categoryRouter.route('/').get(categoryController.getAll)
    .post(categoryController.createCategory)

categoryRouter.route('/:id')
    .get(categoryController.getOne)
//     .put(categoryController.updateCategory)
//     .delete(categoryController.deleteCategor)

module.exports = categoryRouter