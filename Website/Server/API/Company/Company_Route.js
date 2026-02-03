const Express = require("express");
const Route = Express.Router();
const { Companies, Create, verifyEmail, forgotPassword, resetPassword, resendResetOTP, View, Update, Delete, uploadImage } = require('./Company_Controller')



Route.get('/', Companies)
Route.post('/', uploadImage, Create)
Route.post("/verify_email", verifyEmail);
Route.post("/forgot_password", forgotPassword);
Route.post("/reset_password/:token", resetPassword);
Route.post("/resend_reset_otp", resendResetOTP);
Route.get('/:id', View)
Route.patch('/:id', uploadImage, Update)
Route.delete('/:id', Delete)





module.exports = Route