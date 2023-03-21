const express = require("express");
const bodyParser = require("body-parser");
const nationController = require("../Controllers/nationController");
const nationRouter = express.Router();
const {checkLogin} = require("../config/loginAuth")
const {checkAdmin} = require("../config/adminAuth")
nationRouter.use(bodyParser.json());
nationRouter
  .route("/")
  .get(checkLogin, checkAdmin, nationController.index)
  .post(checkLogin, checkAdmin, nationController.create);

nationRouter
  .route("/editNation/:nationId")
  .get(checkLogin, checkAdmin, nationController.formEdit)
  .post(checkLogin, checkAdmin, nationController.edit);

nationRouter.route("/deleteNation/:nationId").get(checkLogin, checkAdmin, nationController.delete);

module.exports = nationRouter;
