const User = require("../models/users")
const jwt = require("jsonwebtoken")

const authMiddleware = async (req,res,next)=>{

    // check header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({msg : "Authication  invalid"})
    }

    const token  = authHeader.split(" ")[1]
    
    try{
      const payload = jwt.verify(token,process.env.JWT_SECRET)
    //   console.log(payload)


      // attch the user to the job routes
      req.user = {userId : payload.userId,name : payload.name}
      next()
    } catch(error){
    res.status(401).json({msg : "Authication  invalid from auth"})
    }
}

module.exports = authMiddleware