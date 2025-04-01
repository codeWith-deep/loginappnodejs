// const mongoose = require('mongoose');
import mongoose from "mongoose";

const CrudModel = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
  
 
    url_of_Image:{
        type:String,
        require:true
    }
})


const User = mongoose.model('newcrudDB', CrudModel)

// module.exports = users; 

export default User;