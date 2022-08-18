const operatorController = require('../controllers/operator.js')
const authUser = require('../middlewares/userType.js');

const operatorRoutes = require('express').Router();

operatorRoutes.route('/')
    .get(authUser.checkUserType('operator'),operatorController.getAll)

operatorRoutes.route('/:id')
    .get(authUser.checkUserType('operator'),operatorController.getOne)
    .put(authUser.checkUserType('operator'),operatorController.updateOperator)

module.exports = operatorRoutes