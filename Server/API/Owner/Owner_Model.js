const Mongoose = require('mongoose');


let current = new Date();
let timeStamp = current.setHours(current.getHours() + 6);



const OwnerSchema = Mongoose.Schema({
    name: {
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
    business_type: {
        type: String,
    },
    business_address: {
        type: String,
    },
    note: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: timeStamp
    },
})

let Owner = Mongoose.model('Owner', OwnerSchema)

module.exports = Owner;