const Express = require("express");
const Route = Express.Router();
const { Positions, Create, View, Update, Delete } = require('./Position_Controller')



Route.get('/', Positions)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route