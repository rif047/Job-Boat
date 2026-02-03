const Express = require('express');
const Route = Express.Router();


const Job = require('./API/Job/Job_Route.js');
const Employee = require('./API/Employee/Employee_Route.js');
const Company = require('./API/Company/Company_Route.js');
const User = require('./API/User/User_Route.js');


Route.get('/', (req, res) => res.send('Server Running'));


Route.use('/jobs', Job);

Route.use('/employees', Employee);

Route.use('/companies', Company);

Route.use('/users', User);


Route.use((err, req, res, next) => {
    console.error('Error in routes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = Route;
