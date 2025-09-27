const Express = require("express");
const Route = Express.Router();
const { Jobs, Create, View, Update, InProgress, PendingPayment, Closed, Cancelled, Delete, uploadImages } = require('./Job_Controller')



Route.get('/', Jobs)
Route.post('/', uploadImages, Create)
Route.get('/:id', View)
Route.patch('/:id', uploadImages, Update)
Route.patch('/in_progress/:id', InProgress)
Route.patch('/pending_payment/:id', PendingPayment)
Route.patch('/closed/:id', Closed)
Route.patch('/cancelled/:id', Cancelled)
Route.delete('/:id', Delete)







module.exports = Route