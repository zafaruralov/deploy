const categoryController = require('../controllers/category.js')
const express = require('express');
const categoryRouter = express.Router()

categoryRouter.route('/').get(categoryController.getAll)
    
categoryRouter.route('/create').post(categoryController.createCategory)

categoryRouter.route('/:id')
    .get(categoryController.getOne)

module.exports = categoryRouter