const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    name:  {
        type: String,
        default: "User Name",
        required: true

    },
    YOB:  {
        type: String,
        default:"2001",
        required: true

    },
    isAdmin:  {
        type: Boolean,
        required: true,
        default: false
    }
},
{timestamps: true});

var users = mongoose.model("Users", userSchema)
module.exports = users;