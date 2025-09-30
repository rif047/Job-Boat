const Express = require("express");
const Route = Express.Router();
const { Jobs, Create, View, Update, InProgress, PendingPayment, Closed, LeadLost, DealCancelled, Delete } = require('./Job_Controller')



Route.get('/', Jobs)
Route.post('/', Create)
Route.get('/:id', View)
Route.patch('/:id', Update)
Route.patch('/in_progress/:id', InProgress)
Route.patch('/pending_payment/:id', PendingPayment)
Route.patch('/closed/:id', Closed)
Route.patch('/lead_lost/:id', LeadLost)
Route.patch('/deal_cancelled/:id', DealCancelled)
Route.delete('/:id', Delete)







module.exports = Route