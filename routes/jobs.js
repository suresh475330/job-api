const express = require("express");
const router = express.Router()

const {getAllJobs,getJob,createJob,
    updateJob,delateJob } = require("../controllers/jobs")


router.get("/",getAllJobs)
router.post("/",createJob)
router.get("/:id",getJob)
router.patch("/:id",updateJob)
router.delete("/:id",delateJob)

module.exports = router