const checkAdmin = (req, res, next) => {
    var isAdmin = req.data.isAdmin
    // console.log(isAdmin)
    if(isAdmin===true){
      // res.json('Bạn là Admin')
      next()
    } else {
      req.flash('error_msg', 'NOT PERMISSION! YOU ARE NOT ADMIN!')
      res.redirect('/')
    }
  }
module.exports = {checkAdmin}