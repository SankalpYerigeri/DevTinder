const app = require("express")

const requestsRouter = app.Router();
const {userAuth} = require("../middlewares/auth")


requestsRouter.post("/connectionRequest",userAuth, (req, res)=>{

    const user = req.user
    res.send("Connection request sent by " + user._id);
})

module.exports = requestsRouter