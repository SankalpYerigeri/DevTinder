const app = require("express")
const { userAuth } = require("../middlewares/auth");
const connectionRequests = require("../models/connectionRequests");

const userRouter = app.Router()

userRouter.get("/user/requests/received", userAuth, async (req,res)=>{
    try
    {
        const loggedInUser = req.user;

        const requestsReceived = await connectionRequests.find({
        toUserId: loggedInUser._id,
        status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "gender", "age"]);

        if(requestsReceived.length === 0)
        {
            throw new Error("No Requests found you creep")
        }

        

        res.json({
            message: "Connection Requests fetched Successfully",
            requestsReceived
        })
    }
    catch(err)
    {
        res.status(400).send("Error: " + err.message)
    }
});

userRouter.get("/user/connections", userAuth, async (req, res)=>
{
    try
    {
        const loggedInUser = req.user;

        const friendsList = await connectionRequests.find({
        $or: [
            {fromUserId: loggedInUser, status: "accepted"},
            {toUserId: loggedInUser, status: "accepted"}
        ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender"])
        .populate("toUserId", ["firstName", "lastName", "age", "gender"])


        const data = friendsList.map((row)=>
        {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({
            message: "Friends List fetched Successfully",
            data
        })
    }
    catch(err)
    {

    }

    
})


module.exports = userRouter