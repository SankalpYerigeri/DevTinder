const app = require("express")

const profileRouter = app.Router()
const User = require("../models/user")
const {userAuth} = require("../middlewares/auth")
const validateEditProfile = require("../utils/editProfile")
const user = require("../models/user")

profileRouter.get("/profile/view",userAuth, async (req, res)=>{
    
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

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        if(!validateEditProfile)
        {
            throw new Error("Invalid edits")
        }

        console.log(loggedInUser)
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))

        console.log(loggedInUser)
        await loggedInUser.save()

        res.json({
            message: "Profile Updates",
            data: loggedInUser
        })
    }
    catch(err)
    {
        res.status(400).send("Error" + err.message)
    }
})



module.exports = profileRouter