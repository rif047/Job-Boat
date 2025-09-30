const Mongoose = require('mongoose');






const EmployeeSchema = Mongoose.Schema({
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
    position: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    preferred_location: {
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
    agent: {
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

let Employee = Mongoose.model('Employee', EmployeeSchema)

module.exports = Employee;