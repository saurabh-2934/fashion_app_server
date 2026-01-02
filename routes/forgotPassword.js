const express = require('express')
const controller = require('../controllers/forgotPassword.controller')

const routes = express.Router()

routes.put('/send-email',controller.sendMail)
routes.put('/verify-otp', controller.verifyOtp)
routes.put('/change-password', controller.setnewPassword)
module.exports = routes