require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const authMiddleware = require("./middleware/Auth")
const {StatusCodes} = require("http-status-codes")

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// routers
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")

// body paser
app.use(express.json())

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/jobs",authMiddleware,jobsRouter)


app.get("/",(req,res)=>{
  res.status(StatusCodes.OK).send(`<h1 style="color:red;">Welcome to Jobs Api</h1>`)
}) 

app.all("*",(req,res)=>{
    res.status(StatusCodes.NOT_FOUND).send(`<h1>Can't find the page</h1>
    <a href="/">Go Home </a>`)
})


const port = process.env.PORT || 3000

const Start = async ()=>{
  try {
   await connectDB(process.env.MONGO_URI2)
    app.listen(port,()=>{
        console.log(`Server is runing on port ${port}...`);
    })
  } catch (error) {
    console.log(error);
  }
}

Start()