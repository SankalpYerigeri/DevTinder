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

app.use(express.json());
app.use(cookieParser())


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

