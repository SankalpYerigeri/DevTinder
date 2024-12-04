const app = require("express")

const profileRouter = app.Router()
const User = require("../models/user")
const {userAuth} = require("../middlewares/auth")

profileRouter.get("/profile",userAuth, async (req, res)=>{
    
    try{
    const user = req.user

    res.send(user)

    }
    catch(err)
    {
        res.status(400).send("The error message is :" + err.message);
    }
})

profileRouter.get("/feed",userAuth, async (req,res)=>{
    const users = await User.find({})
    res.send(users);
})



module.exports = profileRouter