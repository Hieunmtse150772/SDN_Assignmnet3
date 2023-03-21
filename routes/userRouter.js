const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../Controllers/userController")
const userRouter = express()
userRouter.use(bodyParser.json())
const {checkLogin} = require('../config/loginAuth')


userRouter.route("/login").get(userController.login).post(userController.signin)

userRouter.route('/regist').get(userController.regist).post(userController.signup)

userRouter.route('/logout').get(userController.logout)

userRouter.route('/edit-info').get(checkLogin, userController.editInfo).post(checkLogin, userController.edit)


module.exports = userRouter;







// var express = require("express");
// const userController = require("../controllers/userController");
// var userRouter = express.Router();

// const { ensureAuthenticated } = require("../config/auth");

// userRouter
// .route("/")
// .get(userController.index)
// .post(userController.regist);
// userRouter
//   .route("/login")
//   .get(userController.login)
//   .post(userController.signin);
// userRouter
//   .route("/dashboard")
//   .get(userController.dashboard, ensureAuthenticated);
// userRouter
// .route("/logout").get(userController.signout);

// module.exports = userRouter;

