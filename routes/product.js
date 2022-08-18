const productController = require('../controllers/products.js')
const authUser = require('../middlewares/userType.js');
const productsRouter = require('express').Router()

// productsRouter
//     .route('/:imageId')
//     .get(authUser.checkUserType('superAdmin'),upload.single('image'), productController.getInvoice)

productsRouter
    .route('/')
    .get(authUser.checkUserType('superAdmin'),productController.getAll)
    .post(authUser.checkUserType('superAdmin'), productController.createProducts)
productsRouter
    .route('/:id')
    .get(authUser.checkUserType('superAdmin'), productController.getOne)
    .put(authUser.checkUserType('superAdmin'), productController.updateProducts) // post qisayam boladi
    .delete(authUser.checkUserType('superAdmin'), productController.deleteProducts)

module.exports = productsRouter
