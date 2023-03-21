const express = require('express');
const bodyParser = require("body-parser");
const routerIndex = express.Router();
routerIndex.use(bodyParser.json())
const playerController = require('../Controllers/playerController');
const nationController = require('../Controllers/nationController');
const userController = require('../Controllers/userController')
const { checkLogin } = require('../config/loginAuth');
/* GET home page. */
routerIndex.route('/').get(playerController.indexAll);
routerIndex.route('/users/players').get(playerController.playersAll)
routerIndex.route('/users/nations').get(nationController.nationAll)
routerIndex.route("/users/detail/:playerId").get(playerController.getProfileAll);
routerIndex.route("/paging-player").get(playerController.paging);
routerIndex.route('/error').get(userController.error)
// routerIndex.get('/', userController.cookie, function(req, res, next){
//   res.render('headerAll')
// })


module.exports = routerIndex;
