const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../Controllers/userController")
const accountsRouter = express()
accountsRouter.use(bodyParser.json())
const { checkLogin } = require("../config/loginAuth")
const { checkAdmin } = require("../config/adminAuth")

accountsRouter.route('/accounts').get(checkLogin, checkAdmin, userController.listAccounts)
module.exports = accountsRouter;
