const Express = require('express');
const Route = Express.Router();


const Job = require('./API/Job/Job_Route.js');
const Employee = require('./API/Employee/Employee_Route.js');
const Owner = require('./API/Owner/Owner_Route.js');
const Agent = require('./API/Agent/Agent_Route.js');
const Expense_Category = require('./API/Expense/Expense_Category/Expense_Category_Route.js');
const Expense = require('./API/Expense/Expense_Route.js');
const User = require('./API/User/User_Route.js');


Route.get('/', (req, res) => res.send('Server Running'));


Route.use('/jobs', Job);

Route.use('/employees', Employee);

Route.use('/owners', Owner);

Route.use('/agents', Agent);

Route.use('/expenses', Expense);
Route.use('/expense_categories', Expense_Category);

Route.use('/users', User);


Route.use((err, req, res, next) => {
    console.error('Error in routes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = Route;
