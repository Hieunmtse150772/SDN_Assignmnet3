const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const checkLogin = (req, res, next) => {
  try {
    var token = req.cookies.token
    var idUser = jwt.verify(token, 'mk')
    Users.findOne({
      _id: idUser
    })
      .then(data => {
        if (data) {
          req.data = data
          next()
        } else {
          req.flash('error_msg', 'You must login first!')
          res.redirect('/users/login')
        }
      })
      .catch(err => {
        res.json('ERROR')
      })
  } catch (err) {
    req.flash('error_msg', 'You must login first!')
    res.redirect('/users/login')
  }
}
module.exports = { checkLogin }