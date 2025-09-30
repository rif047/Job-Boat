const Mongoose = require('mongoose');






const ExpenseCategorySchema = Mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
})

let Expense_Category = Mongoose.model('Expense_Category', ExpenseCategorySchema)

module.exports = Expense_Category;