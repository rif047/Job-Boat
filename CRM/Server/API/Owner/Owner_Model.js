const Mongoose = require('mongoose');


const OwnerSchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    agent: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    alt_phone: {
        type: Number
    },
    business_name: {
        type: String
    },
    business_address: {
        type: String,
    },
    remark: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Owner = Mongoose.model('Owner', OwnerSchema)

module.exports = Owner;