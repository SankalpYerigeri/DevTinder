const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId :
    {
        type: mongoose.Schema.Types.ObjectId
    },
    toUserId :
    {
        type: mongoose.Schema.Types.ObjectId
    },
    status :
    {
        type: String,
        enum: {
            values: ["ignored", "accepted", "interested", "rejected"],
            message: "{VALUE} is incorrect type"
        }
    }
},
{
    timestamps : true
})

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(this.toUserId)){
        throw new Error("Connection request cannot be sent self")
    }

    next();
})



module.exports = mongoose.model("connectionRequest", connectionRequestSchema)

