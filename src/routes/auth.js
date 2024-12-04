const app = require("express")

const authRouter = app.Router()

const User = require("../models/user")
const bcrypt = require("bcrypt")
const {validateSignupData} = require("../utils/validation")

authRouter.post("/signup", async (req, res)=>
    {
    
    
        try{
        validateSignupData(req);
    
        const {firstName, lastName, emailId, password, gender} = req.body;
        
    
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);
    
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            gender
        }); // This creates a new instance(document) of the User model
        
        await user.save();//This will push the data to database
        
        res.send("User Saved Successfully");
        }
        catch(err)
        {
            res.status(400).send("Error Signing Up!" +err.message)
        }
    
        
    })

authRouter.post("/login", async (req, res)=>{
    

    try{
    const {emailId, password} = req.body;

    const user =await User.findOne({emailId:emailId})



    if(!user)
    {
        throw new Error("Invalid EmailID")
    }
    else
    {
        const validPassword = await bcrypt.compare(password, user.password)

        if(validPassword)
        {
            const token = await user.getJWT();  // Creating a token

            //Sending the token to the user

            res.cookie("token", token)
            res.send("User login successffulll")
        }
        else
        {
            throw new Error("Invalid Credentials")
        }
    }
        }
catch(err)
{
    res.status(400).send("ERROR:" + err.message);
}

    })

authRouter.post("/logout", (req,res)=>
{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logged out Successfully")
})



module.exports = authRouter;