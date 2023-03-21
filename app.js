const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const indexRouter = require("./routes/indexRouter");
const usersRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter")
const playerRouter = require("./routes/playerRouter");
const nationRouter = require("./routes/nationRouter");



const mongoose = require("mongoose");
const Players = require("./models/players");
const Users = require("./models/users")
const jwt = require('jsonwebtoken');
const accountsRouter = require("./routes/accountsRouter");
const url = "mongodb://127.0.0.1:27017/worldcupServer";
const connect = mongoose.connect(url);
const session = require('express-session');
const flash = require('connect-flash');


connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
// app.use(express.static('views'));
// app.get('/', (req, res)=>{
//   res.render('index')
// })

app.use("/", indexRouter);
app.use("/", accountsRouter)
app.use("/users", usersRouter);
app.use("/admin", adminRouter)
app.use("/admin/players", playerRouter);
app.use("/admin/nations", nationRouter);

// Check login
// var checkLogin = (req, res, next) => {
//   try {
//     var token = req.cookies.token
//     var idUser = jwt.verify(token, 'mk')
//     Users.findOne({
//       _id: idUser
//     })
//       .then(data => {
//         if (data) {
//           req.data = data
//           next()
//         } else {
//           res.json('NOT PERMISSIONaaa')
//         }
//       })
//       .catch(err => {
  
//       })
//   } catch (err) {
//     res.status(500).json(c'Token khong hop le')
//   }
// }
// app.get('/')
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/aboutus.html');
// });

// Check admin
// var checkAdmin = (req, res, next) => {
//   var isAdmin = req.data.isAdmin
//   // console.log(isAdmin)
//   if(isAdmin===true){
//     // res.json('Bạn là Admin')
//     next()
//   } else {
//     res.json('NOT PERMISSION')
//   }
// }

// app.get('/detail', checkLogin , (req, res, next) => {
//   res.json('Bạn được ở đây')
  
// })

// app.get('/admin', checkLogin , checkAdmin, (req, res, next) => {
//   next()
// }, (req, res, next)=>{
//   res.json('Bạn là Admin')
// })

app.get('/home', (req, res, next)=>{
  res.render('home')
})



// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).redirect('/error')
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
