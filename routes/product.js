const productController = require('../controllers/products.js')
const authUser = require('../middlewares/userType.js');
const productsRouter = require('express').Router()
const { body } = require('express-validator');

productsRouter
    .route('/')
    .get(authUser.checkUserType('superAdmin'),productController.getAll)
    
productsRouter
    .route('/create').post(authUser.checkUserType('superAdmin'),
    [
        body('name')
          .trim()
          .isLength({ min: 15 })
      ],
     productController.createProducts)
productsRouter
    .route('/:id')
    .get(authUser.checkUserType('superAdmin'), productController.getOne)
    .put(authUser.checkUserType('superAdmin'), productController.updateProducts) // post qisayam boladi
    .delete(authUser.checkUserType('superAdmin'), productController.deleteProducts)

module.exports = productsRouter
