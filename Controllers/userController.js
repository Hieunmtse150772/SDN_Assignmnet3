const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const moment = require('moment');

class userController {

  // List accounts Users
  listAccounts(req, res, next) {
    Users.find({})
      .then((users) => {
        res.render("accounts", {
          title: "Account",
          users: users,
          button: req.cookies.ckbutton,
          name: req.cookies.ckname
        });
      })
      .catch(next);
  }

  // Render register
  regist(req, res, next){
      res.render('register',{
        title: 'Register',
        button: req.cookies.ckbutton,
        name: req.cookies.ckname        
      })   
  }

  // Sign up
  signup(req, res, next) {
    const { username, password, name, YOB, isAdmin } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (!YOB) {
      errors.push({ msg: "Please enter your birth date" });
    } else {
      if (!moment(YOB, 'DD/MM/YYYY', true).isValid()) {
        errors.push({ msg: "Invalid date format. Please enter date in DD/MM/YYYY format." });
      } else{
      const currentYear = new Date().getFullYear();
      const minAge = 18;
      const birthYear = new Date(YOB).getFullYear();
      const age = currentYear - birthYear;
      if (age < minAge) {
        errors.push({ msg: `You must be at least ${minAge} years old to register` });
      }
    }
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
        title: 'Register',
        button: req.cookies.ckbutton,
        name: req.cookies.ckname 
      });
    } else {
      Users.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
            title: 'Register',
            button: req.cookies.ckbutton,
            name: req.cookies.ckname 
          });
        } else {
          const newUser = new Users({
            username,
            password,
            name,
            YOB,
            isAdmin
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg', '[SUCCESS] You have registed successfully! Login now! .'); 
                res.redirect("/users/login");
              })
              .catch(next);
          });
        }
      });
    }
  }
  

  // Render login
  login(req, res, next) {
      res.render('login',{
        title: 'Login',
        button: req.cookies.ckbutton,
        name: req.cookies.ckname,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
      })     
  }

  // Sign in
  signin(req, res, next) {
      const username = req.body.username
      const password = req.body.password
      
      if(!username || !password){        
        return res.json({message: 'WARNING: Please enter all field!'})     
      } else {
      
      
        Users.findOne({
          username: username,        
        }).then(data => {               
            bcrypt.compare(password, data.password, function(err, isMatch) {
              if(isMatch){
                var token = jwt.sign(
                  { _id: data._id }, 'mk'
                )
                
                return res.json({
                  message: 'thanh cong',
                  token: token,
                  name: data.name,
                  isAdmin: data.isAdmin             
                })
              } else {
                return res.json({message: 'WARNING: Username or password are not match! '})
              }
              
          });
            
      
          
        
        }).catch(err => {
          res.status(500).json('Server error!')  
        })
      }
    }
  
  // Edit information
  editInfo(req, res, next) {
    var token = req.cookies.token
    var idUser = jwt.verify(token, 'mk')
    Users.findOne({_id: idUser})
      .then((users) => {
        res.render("editInfo", {
          title: "Profile",
          user: users,
          button: req.cookies.ckbutton,
          name: req.cookies.ckname , 
          success_msg: req.flash('success_msg'),
          error_msg: req.flash('error_msg')           
        });
      })
      .catch(next);
  }

  // edit user info
edit(req, res, next) {
  var token = req.cookies.token
  var idUser = jwt.verify(token, 'mk')
  // Validate YOB
  const yob = req.body.YOB;
  const yobFormat = 'DD/MM/YYYY';
  if (!yob) {
    req.flash('error_msg', '[ERROR] Please enter your birth date.' );
    res.redirect('/users/edit-info')
  } else {
    if (!moment(yob, yobFormat, true).isValid()) {
      req.flash('error_msg', '[ERROR] Invalid year of birth! Please enter a valid date in DD/MM/YYYY format.');
      res.redirect('/users/edit-info');
    } else{
      Users.updateOne({ _id: idUser }, req.body)
      .then(() => {
        Users.findOne({ _id: idUser })
          .then(user => {
            res.cookie('ckname', user.name)
            req.flash('success_msg', '[SUCCESS] You have updated successfully!');
            res.redirect('/users/edit-info')
          })
      }).catch(next);
    }
  }
}


  // admin
  admin(req, res, next){  
      res.render('admin',{
        title: 'Admin',
        button: req.cookies.ckbutton,
        name: req.cookies.ckname
      })  
  }

  // logout
  logout(req, res) {
    res.clearCookie('token');
    res.clearCookie('ckname');
    res.clearCookie('ckbutton');
    res.redirect('/')
  }

  error(req, res){
    res.render('error')
  }
}
module.exports = new userController();


















































// const Users = require("../models/users");
// const bcrypt = require("bcrypt");
// const express = require("express");
// var passport = require("passport");
// var authenticate = require('../config/auth');

// class userController {
//   index(req, res, next) {
//     res.render("register");
//   }
  
//   regist(req, res, next) {
//     const { username, password, isAdmin} = req.body;
//     let errors = [];
//     if (!username || !password) {
//       errors.push({ msg: "Please enter all fields" });
//     }
//     if (password.length < 6) {
//       errors.push({ msg: "Password must be at least 6 characters" });
//     }
//     if (errors.length > 0) {
//       res.render("register", {
//         errors,
//         username,
//         password,
//         isAdmin,
//       });
//     } else {
//       Users.findOne({ username: username }).then((user) => {
//         if (user) {
//           errors.push({ msg: "Username already exists" });
//           res.render("register", {
//             errors,
//             username,
//             password,
//             isAdmin,
//           });
//         } else {
//           const newUser = new Users({
//             username,
//             password,
//             isAdmin,
//           });
//           //Hash password
//           bcrypt.hash(newUser.password, 10, function (err, hash) {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then((user) => {
//                 res.redirect("/users/login");
//               })
//               .catch(next);
//           });
//         }
//       });
//     }
//   }

//   login(req, res, next) {
//     res.render("login");
//   }
//   signin(req, res, next) {
//     passport.authenticate("local", {
//       successRedirect: "/users/dashboard",
//       failureRedirect: "/users/login",
//       failureFlash: true,
//     })(req, res, next);
//   }
//   dashboard(req, res, next) {
//     res.render("dashboard");
//   }
//   signout(req, res, next) {
//     req.logout(function (err) {
//       if (err) {
        
//         return next(err);
//       }
//       req.flash("success_msg", "You are logged out");
      
//       res.redirect("/users/login");
//     });
//   }
  
// }

// module.exports = new userController();
