const Express = require("express");
const Route = Express.Router();
const { Cities, Create, View, Update, Delete } = require('./City_Controller')



Route.get('/', Cities)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route