var jwt = require('jsonwebtoken')

var data = {username: 'Duydeptrai',password: 'Haha'}

var token = jwt.sign(data, '123456')

var m = jwt.verify(token, "123456")
console.log(m)
