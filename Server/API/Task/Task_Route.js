const Express = require("express");
const Route = Express.Router();
const { Tasks, Create, View, Update, Delete } = require('./Task_Controller')



Route.get('/', Tasks)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route