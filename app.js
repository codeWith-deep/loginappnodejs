// const bodyParser = require('body-parser');
// const fromRouter = require('./routers/route')
import  cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
// import fromRouter from ('./routers/route.js')
import router from './routers/route.js';
import mongoose from 'mongoose';
import express from 'express'
import multer from 'multer'
import fileUpload from 'express-fileupload';
// const express = require'express'
const app  = express() 
const PORT = 3000;
// const mongoose = require("mongoose");
// app.use(fileUpload({
//     useTempFiles: true
// }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json() )
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' })



const mongodb ="mongodb://localhost:27017/userdatabase";
 

mongoose.connect(mongodb ,{ useNewUrlParser: true,
    useUnifiedTopology: true })

.then((success)=> console.log("Mongodb conneted successfully")) 
   
.catch((err)=> console.log(err.message));
 


app.use('/', router)





 










app.listen(PORT, () => {
    console.log(`server is listen on this ${PORT}`)
})

