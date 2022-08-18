const accountantController = require('../controllers/accountant.js')
const authUser = require('../middlewares/userType.js');
const accountantRoutes = require('express').Router();

accountantRoutes.route('/')
    .get(authUser.checkUserType('accountant'),accountantController.getAll)

accountantRoutes.route('/:id')
    .get(authUser.checkUserType('accountant'),accountantController.getOne)
    .put(authUser.checkUserType('accountant'),accountantController.updatAccountant)

module.exports = accountantRoutes