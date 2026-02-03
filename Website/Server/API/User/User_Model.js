const Mongoose = require('mongoose');






const UserSchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    userType: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    secret_code: {
        type: String,
        required: true
    },
    remark: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
})

let User = Mongoose.model('User', UserSchema)

module.exports = User;