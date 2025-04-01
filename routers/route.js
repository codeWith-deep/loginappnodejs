// const UserController = require('../controller/controller');
import verifycookies from '../middleware/auth.js' 
// import checkUserAuth from '../middleware/auth.js' 

import UserController from '../controller/controller.js';
// import fromControllerFile from ('../controller/controller.js')
import express from 'express'
import multer from 'multer'
// const upload = multer({ dest: 'uploads/' })
import {upload} from '../middleware/multerMiddleware.js'
import fileUpload from 'express-fileupload';
// const express = require('express')
const router = express.Router();


router.use('/passwordChange', verifycookies)
// router.use('/passwordChange',  checkUserAuth)
// router.use('/loggedUser', CheckuserAuth)

router.get('/', UserController.home);
// router.post('/login', UserController.LoginVerify);
router.get('/register', UserController.register);
router.post('/register', upload.single('avatar'), UserController.CreateUserDoc);
router.get('/login', UserController.login);
router.post('/login', UserController.LoginVerify);
router.get('/logout', UserController.logoutFunction);
// router.get('/logout', UserController.logoutGet);
router.get('/afterLoginPage', UserController.afterLoginPage);
router.get('/passwordChange', UserController.passwordChange)
router.get('/forgetPassword', UserController.forgetPassword)
// router.post('/register', upload.single('avatar'), UserController.fileWithMulterFunction)
// router.get('/passwordReset', UserController.passwordReset)
router.post('/forgetPassword', UserController.sendUserPasswordResetEmail);
router.get('/resetpassword/:id/:token', UserController.verifylinkdata);
router.post('/resetpassword/:id/:token', UserController.UserPasswordResetVerifyLink);
// router.post('/register',fromControllerFile.RegisterUser);
// router.get('/findalldata/:id', fromControllerFile.SomeValidations)
// router.put('/update/:id', fromControllerFile.update)
// router.delete('/deleteApi/:id', fromControllerFile.DeleteApi)

// PROTECTED ROUTED 
router.post('/passwordChange',  UserController.changePassword)
// router.get('/loggedUser',  UserController.loggedUser)

 
// ROUTE FOR TOKEN CHECK AND PROTECTED DATA 

export default router;

// module.exports = router;