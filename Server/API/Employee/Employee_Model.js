const Mongoose = require('mongoose');


let current = new Date();
let timeStamp = current.setHours(current.getHours() + 6);



const EmployeeSchema = Mongoose.Schema({
    agent: {
        type: String,
        required: true
    },
    position: {
        type: Array,
        required: true
    },
    city: {
        type: Array,
        required: true
    },
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
    address: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },

    right_to_work: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: timeStamp
    },
})

let Employee = Mongoose.model('Employee', EmployeeSchema)

module.exports = Employee;