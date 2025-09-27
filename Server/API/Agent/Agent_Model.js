const Mongoose = require('mongoose');


let current = new Date();
let timeStamp = current.setHours(current.getHours() + 6);



const AgentSchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    designation: {
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

let Agent = Mongoose.model('Agent', AgentSchema)

module.exports = Agent;