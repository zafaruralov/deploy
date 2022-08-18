const courierController = require('../controllers/courier.js')
const authUser = require('../middlewares/userType.js');
const courierRoutes = require('express').Router();

courierRoutes.route('/')
    .get(authUser.checkUserType('courier'),courierController.getAll)

courierRoutes.route('/:id')
    .get(authUser.checkUserType('courier'),courierController.getOne)
    .put(authUser.checkUserType('courier'),courierController.updateCourier)

module.exports = courierRoutes