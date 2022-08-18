const searchController = require('../controllers/search.js')
const authUser = require('../middlewares/userType.js');
const searchRoutes = require('express').Router()

searchRoutes
    .route('/')
    .get(authUser.checkUserType('superAdmin'),searchController.getAll)
    // .get(searchController.getAll)

module.exports = searchRoutes
