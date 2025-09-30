const Mongoose = require('mongoose');



let bdOffset = 6 * 60;



const JobSchema = Mongoose.Schema({
    position: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    business_name: {
        type: String,
    },
    owner: {
        type: String
    },
    employee: {
        type: String
    },
    agent: {
        type: String
    },
    wages: {
        type: Number,
    },
    charge: {
        type: Number
    },
    accommodation: {
        type: String
    },
    required_experience: {
        type: String
    },
    date: {
        type: String
    },
    right_to_work: {
        type: String
    },
    status: {
        type: String
    },
    remark: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Job = Mongoose.model('Job', JobSchema)

module.exports = Job;