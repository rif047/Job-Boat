const Express = require("express");
const Route = Express.Router();
const { Owners, Create, View, Update, Delete } = require('./Owner_Controller')



Route.get('/', Owners)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route