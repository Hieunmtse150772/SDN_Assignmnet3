const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../Controllers/playerController");
const playerRouter = express.Router();
const {checkLogin} = require("../config/loginAuth")
const {checkAdmin} = require("../config/adminAuth")
playerRouter.use(bodyParser.json());
playerRouter.route("/").get(checkLogin, checkAdmin, playerController.index)
                       .post(checkLogin, checkAdmin, playerController.create);

playerRouter.route("/editPlayer/:playerId").get(checkLogin, checkAdmin, playerController.formEdit)
                                           .post(checkLogin, checkAdmin, playerController.edit);
                                           
playerRouter.route("/filter").get(playerController.filter).post(playerController.filter);

playerRouter.route("/search").get(playerController.search).post(playerController.search);

playerRouter.route("/deletePlayer/:playerId").get(checkLogin, checkAdmin, playerController.delete);

playerRouter.route("/profile/:playerId").get(checkLogin, checkAdmin, playerController.getProfile);


module.exports = playerRouter;
