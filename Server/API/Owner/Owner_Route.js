const Express = require("express");
const Route = Express.Router();
const { Owners, Create, BulkImport, View, Update, Delete } = require('./Owner_Controller')



Route.get('/', Owners)
Route.post('/', Create)
Route.post('/bulk', BulkImport);
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.delete('/:id', Delete)







module.exports = Route