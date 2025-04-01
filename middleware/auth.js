
import jwt from 'jsonwebtoken'
// import UserModel from '../models/model.js'
import User from '../models/model.js';
const secrite_key = "lksdlsgjiowr123knfn##";

var checkUserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        // req.user.body;
        // Get Token from header
      token = authorization.split(' ')[1]
  
        // Verify Token
        const  {userID}  = jwt.verify(token, secrite_key)
  
        // Get User from Token
 const user = await User.findById(userID).select('-password')
        if(!user){
            console.log("user not found from token")
        }
        
       req.user = user;
          console.log( "finally user mil hi hi gya token vcho")
           
          console.log( "from token data",user)
     next()
    
      } catch (error) {
        console.log(error)
        res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
      }
    }
    if (!token) {
      res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
  }
    

  // var cookiesVerify  = async (req, res, next)( {
    // var user = {name:'test'}; //!! find the user and check user from db then
     
 
  
    var verifyCookies = async (req, res, next) => {
      // let token
      const token = req.cookies.access_token;
      console.log( "from cookies toh",token)
      if (token) {
        try {
          // req.user.body;
          // Get Token from header
        // token = authorization.split(' ')[1]
             
          // Verify Token
          const {userID}  = jwt.verify(token, secrite_key)
         console.log("user cookies toh", userID)
          // Get User from Token
   const user = await User.findById(userID).select('-password')
          if(!user){
              console.log("user not found from token")
          }
          
         req.user = user;
            console.log( "finally user mil hi hi gya token vcho")
             
            console.log( "from token data",user)
       next()
      
        } catch (error) {
          console.log(error)
          res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
        }
      }
      if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
      }
    }
      





export default verifyCookies
// export default checkUserAuth
