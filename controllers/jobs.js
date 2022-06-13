const Job = require("../models/jobs")
const {StatusCodes} = require("http-status-codes");


const getAllJobs = async (req,res)=>{
    try {
        // console.log(req.user);
        const job = await Job.find({createdBy : req.user.userId}).sort("createdAt")
        res.status(StatusCodes.OK).json({job,count : job.length})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({msg : error.message})
    }
}


const getJob = async (req,res)=>{
    try{
        const {user : {userId} ,params:{id:jobId}} =  req
        //  console.log(userId,jobId);
    
         const oneJob = await Job.findOne({_id : jobId,createdBy : userId})
         
         if(!oneJob){
            return res.status(StatusCodes.BAD_REQUEST).json({msg : `no job with id : ${jobId}` })
         }
         res.status(StatusCodes.OK).json({oneJob})
    } catch(error){
        if(error.name === "CastError"){
            return res.status(StatusCodes.NOT_FOUND).json({msg : `No item found with id : ${error.value} `})
        }
        res.status(StatusCodes.BAD_REQUEST).json({error,msg : error.message})
    }
    
}


const createJob = async (req,res)=>{
    try{
        // console.log(req.user);
          req.body.createdBy = req.user.userId
           const job = await Job.create(req.body)
    
          res.status(StatusCodes.OK).json({job})
    } catch(error){
       res.status(StatusCodes.BAD_REQUEST).json({msg : "Something worng on Ceated job"})
    }
}


const updateJob = async (req,res)=>{
    const {user : {userId} ,
    params : {id : jobId},
    body : {company,position}} = req;

    if(company === "" || position === ""){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : "Company or Position fields canot be empty"})
    }

    const job = await Job.findByIdAndUpdate({_id : jobId,createdBy : userId},
     req.body,{new : true,runValidators : true})
    
     if(!job){
        return res.status(StatusCodes.BAD_REQUEST).json({msg :`No job match with id : ${jobId}`})
     }
     res.status(StatusCodes.OK).json({job})
}

const delateJob = async (req,res)=>{
    const {user : {userId} ,params:{id:jobId}} =  req

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy : userId
    })
    if(!job){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : `No job with id : ${jobId}`})
    } 

    res.status(StatusCodes.OK).send("succes")
}


module.exports  = {getAllJobs,getJob,createJob,updateJob,delateJob }