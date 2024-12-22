const express = require("express")

const app = express()

const connectDB = require("./config/database")

const User = require("./models/user");
const { default: mongoose } = require("mongoose");
const { ReturnDocument } = require("mongodb");
const {validateSignupData} = require("./utils/validation")

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user")
const cors = require("cors")





app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    })
  );



connectDB()
    .then(()=>{
        console.log("Database connection Established")
        app.listen(7777, ()=>{
            console.log("Successfully listening on 7777")
        });
    })
    .catch((err)=>
    {
        console.log("Error Connecting to the Database")
    })





app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestsRouter)
app.use("/", userRouter)

app.get("/signup", async (req, res)=>
{   
    const name = req.body.firstName;

    const user = await User.findOne({firstName : name})

    res.send(user);
})

app.patch("/user", async (req, res)=>
{
    const userId = req.body.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
        "userId",
        "firstName",
        "lastName",
        "gender",
        "age",
        "skills"
    ]

    const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    

    try{
        if(!isUpdateAllowed)
        {
            throw new Error("Update not allowed")
        }
        const update = await User.findByIdAndUpdate({_id: userId}, data,
        {returnDocument:"after",
        runValidators: true
        })
        console.log(update)
        res.send("User Updated Successfully");
    }
    catch(err)
    {
        res.status(400).send("Something Went Wrong")
    }
    
})

