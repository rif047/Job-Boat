const Express = require("express");
const Route = Express.Router();
const { Agents, Create, View, Update, Delete } = require('./Agent_Controller')



Route.get('/', Agents)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route