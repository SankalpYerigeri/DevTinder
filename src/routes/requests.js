const app = require("express")

const requestsRouter = app.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequests");
const User = require("../models/user");


requestsRouter.post("/connectionRequest",userAuth, (req, res)=>{

    const user = req.user
    res.send("Connection request sent by " + user._id);
})

requestsRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>
{
    try
    {
        const reqId = req.params.requestId;
        const status = req.params.status;
        const loggedInUser = req.user._id;

        const allowedUpdates = ["accepted", "rejected"]

        if(!allowedUpdates.includes(status))
        {
            throw new Error("Invalid request")
        }

        const connectionReq = await connectionRequest.findOne({
            _id: reqId,
            toUserId: loggedInUser,
            status: "interested"
        })

        if(!connectionReq)
        {
            throw new Error("Invalid ID apa")
        }

        connectionReq.status = status
        const data = await connectionReq.save()
        res.json(
            {
                message: "Conncection " + status + "ed" + " Successfully",
                data
            }
        )



    }
    catch(err)
    {
        res.status(400).send("ERROR " + err.message)
    }
})


requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>
{
    try{
    const fromUserId = req.user._id;
    
    const toUserId = req.params.toUserId;
    
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"]

    if(!allowedStatus.includes(status))
    {
        throw new Error("This type of status not allowed")
    }

    const toUser = await User.findById(toUserId)
    
    if(!toUser)
    {
        return res.status(400).send("no such User found")
    }

    const connectionReqExist = await connectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {
                fromUserId: toUserId,
                toUserId: fromUserId
            }
        ]
    })

    

    if(connectionReqExist)
    {
        return res.status(400).send("Connection request already exists")
    }

    const connectionReq = new connectionRequest({
        fromUserId,
        toUserId,
        status
    })

    const data = await connectionReq.save()

    res.json({
        message : "Connection Request sent",
        data
    })


    }
    catch(err)
    {
        res.status(400).send("Error" + err.message)
    }
})

module.exports = requestsRouter