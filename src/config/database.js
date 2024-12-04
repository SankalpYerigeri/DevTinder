const { default: mongoose } = require("mongoose")

const connectDB = async () =>
{
    await mongoose.connect("mongodb+srv://SankalpNode:ZXi1SgNKcIgbfQQh@sankalpnode.0cuth.mongodb.net/devTinder")
}

module.exports = connectDB