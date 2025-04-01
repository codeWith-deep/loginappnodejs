import User from "../models/model.js"
import bycrpt, { genSalt } from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import swal from 'sweetalert';
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';
import { upload } from "../middleware/multerMiddleware.js";
import path from 'path'
import fs from "fs"
// import popup  from 'popups']
// import alert from 'alert'
const secrite_key = "lksdlsgjiowr123knfn##";

   // Configuration
   cloudinary.config({ 
    cloud_name: 'djapgjdjo', 
    api_key: '644545527235646', 
    api_secret: 'y6wdO8GpH8Kjw2ucENjkA_Zhm0Q' // Click 'View API Keys' above to copy your API secret
});


let transporter = nodemailer.createTransport({
    service: 'gmail',
     host: 'smtp.gmail.com',
      port: 535,
      secure: true,
       auth: {
        user: 'sajan8288786@gmail.com',
         pass: 'ricdccencawuopng',
        },
    });


// export default transporter

class UserController {
    static home = (req,res) => {
        res.render('index')
    }
    static register = (req,res) => {
        res.render('register')
    }


    // static fileWithMulterFunction = async (req,res,next) => {
    //       // Upload an image
    //      try {
            
    //               const file =  req.file.path
    //             //   console.log("from deep tohh ",file)
    //         // const response = await this.fileuploadwithcloudinaryseprate(req.files.avatar )
    //      const ImageUploade = await cloudinary.uploader.upload(file)
    //             //    const store_image_in_database = new User({
    //             //     url_of_Image:ImageUploade.secure_url
    //             //    })
    //             //   const saveImage = await store_image_in_database.save();  
    //             //  console.log("image with url ", saveImage)
    //         // console.log("this tihs tjhaj ")
    //            console.log("after uploading details", ImageUploade)
            
    //         //  console.log(req.body)
    //         //  console.log(req.file)
    //        next()
             
    //      } catch (error) {
    //         console.log("from cloundian aaajjk tohhhhh",error)
        
    //      }

    //     }





    static CreateUserDoc = async (req,res,next) => {
    
    // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
                    //  const file =  req.file.path
                //   console.log("from deep tohh ",file)
            // const response = await this.fileuploadwithcloudinaryseprate(req.files.avatar )
         const ImageUploade = await cloudinary.uploader.upload(req.file.path)
        try {
            const hashPassword = await bycrpt.hash(req.body.password, 10)
            const  email = req.body
            
            const userDoc = new User({
                
                name:req.body.name,
                password:hashPassword,
                email:req.body.email,
                url_of_Image:ImageUploade.secure_url
                // image:req.body.file
            })
            console.log("All register user data",userDoc)  
            await userDoc.save();
            
            const user_Saved =  await User.findOne({email:req.body.email})
            if(!user_Saved){
                res.status(201).json({message: "Your email are already exist"})
            }
            // // GENERATE JWT TOKEN 
            const token =   jwt.sign({userID:user_Saved._id}, secrite_key, {expiresIn: "10d"})
            if(!token){
                res.status(400).json({message: "something wrong with token registration time"})
            }
            // console.log("user Register successfully", token)
            // res.status(200).send({message: "register successfully ", token})
            // res.render("login");
        
            res.redirect('/login')
            next()
        } catch (error) {
            console.log('this error form controller and register user tooh ', error)
        }
    }

    // static fileuploadwithcloudinaryseprate = async (localFilePath) => {
    //     // Upload an image
    //    try {
           
    
    //       const response = await cloudinary.uploader.upload(localFilePath, {
    //           resource_type: "auto"// optional folder name
             
    //       })
    //       // localFilePath = response
    //       // file has been uploaded successfull
    //       //console.log("file is uploaded on cloudinary ", response.url);
    //       // fs.unlinkSync(localFilePath)
    //       // return response;
    //       console.log("this tihs tjhaj ")
    //          console.log("form local path ", response)
          
    //        console.log(req.body)
    //        console.log(req.file)
    //      next()
           
    //    } catch (error) {
    //       console.log("from cloundian aaajjk tohhhhh",error.message)
      
    //    }
    // }
        // UPLOAD FILE WITH MULTER 




    static login = (req,res) => {
        res.render('login')
    }

    static afterLoginPage = (req,res) => {
        res.render('afterLoginPage')
    }

    static LoginVerify = async (req,res) =>{
       try{
        // console.log("from new template" , req.body)
           //     console.log('this is sis ssis s')
           //    await res.send(req.body)
           const  {email, password} = req.body;
           const verifyData = await User.findOne({email:email});
        //    console.log( "this is jii ",verifyData)
        // console.log(verifyData.password, "from database")
            
            if(verifyData != null){
                const isMatch  = await bycrpt.compare(password, verifyData.password)
                // if(verifyData.email == email && verifyData.password == password){
                    if(verifyData.email === email && isMatch){
                        // console.log("you can not login because you have changed the password now")
                        const token = jwt.sign({userID:verifyData._id}, secrite_key, {expiresIn: "10d"})
                        res.cookie("access_token", token, {
                            httpOnly: true,
                        })
                        //  secure: process.env.NODE_ENV === "production",
                        // res.render("index")
                        res.redirect('/afterLoginPage')

                        // res.status(200).json({message:'you can login now', verifyData, msg:"this login Token", token})
                    }else{
                        // res.send('your email and password not exist')
                        console.log('your email and password not exist')
                    }
                }
                else {
                    // res.send('your are not a register user ')
                    console.log('your are not a register user ')
                }
                
            } catch (error) {
                console.log("this error form login verfy " ,error)
            }
        }
        static passwordChange = (req,res) => {
            res.render('passwordChange')
        }

        static changePassword = async (req,res) => {
        const  {password, confirmationpassword} = req.body;
    //   const password =  req.body.password 
    //  const confirmationpassword =   req.body.confirmationpassword
        // const password = req.body;
        // const confirmationpassword = req.body;
        // console.log(password)
        // console.log(confirmationpassword)
        // // if(password ==! confirmationpassword){
        //     console.log('both are available')
        // }
        if(password && confirmationpassword){
        if(password !== confirmationpassword){
                // res.status(200).json({message:'Your password and confirmation password do not matched'})
                console.log('Your password and confirmation password do not matched')
                
            }else{
                const salt = await bycrpt.genSalt(10)
                const New_hashPassword = await bycrpt.hash(req.body.password, salt)
                await User.findOneAndUpdate(req.user._id , {$set: {password: New_hashPassword}})
                console.log("from password function ",req.user._id)
           
                // res.status(200).json({message:'Your password have changed successfully'})
                console.log('Your password have changed successfully')
            } 
        }else {
            // res.send({ "status": "failed", "message": "All Fields are Required" })
            console.log("All Fields are Required")
        
        }
    }
    
    
    //  static loggedUser = async (req, res) => {
        // //   return  res.status(200).json({ "user": req.user })
        //   console.log(req.user)
        
        //   }
        static forgetPassword = (req,res) => {
            res.render('forgetPassword')
        }
       
    static sendUserPasswordResetEmail = async (req,res, next) => {  //post request
        const {email} = req.body;
        if(email){
            const user = await User.findOne({email:email})
            if(user){
                const secret = user._id + secrite_key
                const token = jwt.sign({userID:user._id} , secret , {expiresIn:'10d'})
                
          
                
                // const link = `http://127.0.0.1:3000/api/user/${user._id}/${token}`
                const link = `http://localhost:3000/resetpassword/${user._id}/${token}`;
                console.log(link) 

                const info = await transporter.sendMail({
                    from: 'sajan8288786@gmail.com', // sender address
                    to: "test123@yopmail.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html:
                     `<h1 background:black ><a href=${link}>Click here for reset password</a></h1>`, // html body
                  });
                      res.status(200).json("Check Your Email Now")
                  console.log(info);
                // res.status(400).json({ success: false , message: "Your Email is sended successfulley ---open this link", info})
                
                
                
            }else{
                // res.status(400).json({ success: false , message: "Your Email not exist for reset password"})
                console.log("Your Email not exist for reset password")
            }
        }else{
             
            res.status(400).json({ success: false , message: "email field is required"})
            
        }
    }
    
    
  
    
    
    // EMAIL SETUP
    // EMAIL_HOST = 'smtp.gmail.com'
    // EMAIL_PORT = 587
    // EMAIL_USER = 'sajan8288786@gmail.com'
    // EMAIL_PASS = '123456'
    // EMAIL_FROM = 'sajan8288786@gmail.com'

  static verifylinkdata = async (req, res ,next) => {
        const { id, token } = req.params;
        // console.log(req.params);
        // const user = await User.findOne({ _id: id });
        const user = await User.findById(id) 
        // console.log("from user tohh ", user) 
        if (!user) {
               res.json({ status: "User Not Exists!!" });
        }
        // const decode = secrite_key + user._id;
        try {
            // const verify =  jwt.verify(token, decode);
            res.render("link");
            // console.log("from verify tohh ", verify)
            // req.user = verify;  
            // next();
        } catch (error) {
          console.log(error);
          res.send("this is not working");
        }
      };
    
    
    static UserPasswordResetVerifyLink = async (req,res) => {
           const {password , confirmation_password} = req.body;
           const {id, token} = req.params;
           const user = await User.findById(id)  //from link toh find kr reha hai 
           const new_secret = user._id + secrite_key   //ehh database vcho find kr reha hai 
            console.log("from body data toh", password, confirmation_password)
           try {

            jwt.verify(token, new_secret ,function(err) {
                if (err) {
         res.send.status(500).json('your token is expired', err)
        //  let decoded = decoded.id
                    // err = {
                    //   name: 'TokenExpiredError',
                    //   message: 'jwt expired',
                    //   expiredAt: 1408621000
                    // }
               
                }
              })

            if(password && confirmation_password) {
                  if(password !== confirmation_password){
                    // res.render("link", { email: verify.email, status: "Not Verified" });
                res.status(400).json({message:'Your password and confirmation password do not matched'})

                  }else{
                    const New_hashPassword = await bycrpt.hash(password, 10)
                     await User.findOneAndUpdate(user._id , {$set: {password: New_hashPassword}})
                     console.log("from bycryped",user._id)

                    //  res.render("/views/partialsafterRegistrationNavbar");

                     res.status(200).json({message:'Your password have reset jiiiii successfully'})

                  }
                //   if (tokenExpire == "token expired") {
                //      res.send({ status: "error", data: "token expired" });
                //     }
                }else{
                    res.status(400).json({ success: false , message: "all field are required jiiiii sonee jii "})
                    
              
                }
            } catch (error) {
                swal("Hello world!", error);
            //  alert("message",error)
                // popup.alert({
                //     content: 'Hello!',
                //     error 
                // });
            //   res.status(500).json({ success: false , message: "your time has been out try again " })
            
           }
    }
    // static logoutGet = async (req,res) =>{
    //     res.render('logout')
    // }
    static logoutFunction  = async (req,res) => {
       
            // res.cookie.destroy((err) => {
            //   if (err) {
            //  res.status(500).send('Logout failed');
            //   }
            //   console.log('Logged out');
            // });
           
            res.cookie('jwt', " " , {maxAge: 1})
            res.redirect('/')
            
         
    }
}






export default UserController

// module.exports = {
//     UserController,
    
// }



















// const fromView = require('../views/edit.ejs')77
// const fromregister = require('../views/register.ejs')


// const fromRgister = async (req,res) {
//    await res.render('fromregister')
// }

// module.exports ={
//     fromRgister
// }











































// const RegisterUser = async (req,res) => {
//     try {
//         console.log(req.body)
//         const  {address,email,password,name} = req.body;
//         const newUser = new fromModeFile({name,email,password,address})
//          newUser.save();
//         res.send(newUser);
//         console.log(newUser)
     
//     } catch (error) {
//         res.send("user are not registered")
//     }
// }

// VALIDATIONS ON API DATA 
// const SomeValidations = async (req,res) => {

//     try {
//         let abb = req.params;
//         console.log(id)
//         let findData = await fromModeFile.findById(req.params.id);
//         res.status(200).json({
//             message: "this is your all data",
//             findData
//         }) 
//     } catch (error) {
//         res.status(400).json({
//             message: "your data not find from mongoose"
//         })
//     }
// }

// UPDATE API 
// const update = async (req,res) => {

//     try {
//         let {id} = req.params;
//         let {name,email,password,address} = req.body;
//         let NewUpdate = await fromModeFile.findByIdAndUpdate({_id:id},{name,email,password,address}, {new:true});
//         console.log({NewUpdate})
//         res.status(200).json({
//             message: "you data has benn updated",
//             NewUpdate
//         })
        
//     } catch (error) {
//         res.status(400).json({
//             message: "you data not updated",
//             error
//         })
//     }
// }

// DELETE API 

// const DeleteApi = async (req,res) => {

//     try {
//         let  deleteApi = await fromModeFile.findByIdAndDelete(req.params.id)
//         console.log(deleteApi)
//         res.status(200).json({
//             message: "your data had been deleted",
//             deleteApi
//         })
//     } catch (error) {
//         res.status(200).json({
//             message: "your data not deleted",
//             error
//         })
//     }

// }











// module.exports = {
//     RegisterUser,
//     SomeValidations,
//     update,
//     DeleteApi

// };