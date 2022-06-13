const User = require("../models/users")
const {StatusCodes} = require("http-status-codes")

const register = async (req,res)=>{
    try {
        const user = await User.create({...req.body})
        const token = user.createJWT()
       
        res.status(StatusCodes.CREATED).json({user : {name : user.name},token})
    } catch (error) {
        if(error.name === "ValidationError"){
           const msg = Object.values(error.errors)
           .map((item)=> item.message).join(",") 
           return res.status(StatusCodes.BAD_REQUEST).json({msg})
        }

        if(error.code && error.code === 11000){
           return res.status(StatusCodes.BAD_REQUEST).json({mag : `Duplicate value entered for ${Object.keys(error.keyValue)} field, please choose anothor value`})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error, msg : error.message})
    }
}

const login = async (req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            throw new Error("Plaase provide email and password ")
        }
        const user = await User.findOne({ email })

        if(!user){
            throw new Error("invalid credentials user not match")
        }
        // compare password
        const isPasswordCorrect = await user.comparePassword(password)

        if(!isPasswordCorrect){
            throw new Error("invalid credentials password not match")
        }
        const token = user.createJWT()

        res.status(StatusCodes.OK).json({user : {name : user.name}, token})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({msg : error.message})
    }
}

module.exports  = { register,login}