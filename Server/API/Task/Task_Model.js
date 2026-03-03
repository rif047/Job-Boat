const Mongoose = require('mongoose');



const TaskSchema = Mongoose.Schema({
    post: {
        type: Number,
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    query: {
        type: Number,
        required: true
    },
    duplicate_post: {
        type: Number,
        required: true
    },
    call: {
        type: Number,
        required: true
    },
    potential_lead: {
        type: Number,
        required: true
    },
    confirm_lead: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
    no_employee: {
        type: Number,
        required: true
    },
    lost_lead: {
        type: Number,
        required: true
    },


    agent: {
        type: String,
        required: true
    },

    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Task = Mongoose.model('Task', TaskSchema)

module.exports = Task;