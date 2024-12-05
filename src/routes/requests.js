const app = require("express")

const requestsRouter = app.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequests");
const User = require("../models/user");


requestsRouter.post("/connectionRequest",userAuth, (req, res)=>{

    const user = req.user
    res.send("Connection request sent by " + user._id);
})


requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>
{
    try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const toUser = await User.findById(toUserId)
    
    if(!toUser)
    {
        return res.status(400).send("no such User found")
    }

    const connectionReqExist = connectionRequest.find({
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