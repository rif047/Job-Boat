const Express = require("express");
const Route = Express.Router();
const { Employees, Create, View, Update, Delete } = require('./Employee_Controller')



Route.get('/', Employees)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route