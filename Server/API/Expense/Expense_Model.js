const Mongoose = require('mongoose');






const ExpenseSchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    images: {
        type: [String]
    },
    category: {
        type: Mongoose.Types.ObjectId,
        ref: 'Expense_Category',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Expense = Mongoose.model('Expense', ExpenseSchema)

module.exports = Expense;