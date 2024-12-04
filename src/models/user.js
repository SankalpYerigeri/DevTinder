const {mongoose} = require("mongoose")
const jwt = require("jsonwebtoken")

const {Schema} = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true,
        minlength: 4,
    },
    lastName : {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
    },
    emailId: {
        type: String,
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender not Valid")
            }
        },
        
    },
    skills: {
        type: [String]
    }
}, 
{
    timestamps: true 
})

userSchema.methods.getJWT = async function(){
    const user = this

    const token = await jwt.sign({_id: this._id}, "Imsankalp@17", {expiresIn : "1d"})

    return token
}

module.exports = mongoose.model("User", userSchema);