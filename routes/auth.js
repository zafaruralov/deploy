const authController = require('../controllers/auth.js');
const express = require('express')

const authRoutes = express.Router();

authRoutes.route('/login').get(authController.getAll)
authRoutes.route('/login').post(authController.postLogin)
authRoutes.route('/logout').post(authController.postLogout)
authRoutes.route('/signup').post(authController.postSignup)
// authRoutes.route('/signup').get(authController.getSignup)

module.exports = authRoutes