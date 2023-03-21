const express = require('express');
const bodyParser = require("body-parser");
const routerAdmin = express.Router();
routerAdmin.use(bodyParser.json())
const { checkLogin } = require("../config/loginAuth")
const { checkAdmin } = require("../config/adminAuth")
const userController = require('../Controllers/userController');
/* GET home page. */
routerAdmin.route('/').get(checkLogin, checkAdmin, userController.admin)
// routerAdmin.route('/header').get(userController.header)


module.exports = routerAdmin;