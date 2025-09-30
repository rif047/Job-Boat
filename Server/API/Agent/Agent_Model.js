const Mongoose = require('mongoose');






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
    remark: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Agent = Mongoose.model('Agent', AgentSchema)

module.exports = Agent;