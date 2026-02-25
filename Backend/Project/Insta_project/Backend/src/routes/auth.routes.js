const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const identifyUser = require('../middleware/auth.middleware')




authRouter.post("/register" , authController.authRegisterController);
authRouter.post("/login" , authController.authLoginController);
authRouter.get("/getMe" ,identifyUser, authController.getMeController );


module.exports = authRouter;







