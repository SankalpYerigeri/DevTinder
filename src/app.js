const express = require("express")

const app = express()

app.use((req, res)=>
{
    res.send("Hello from Server");
})

app.listen(7777, ()=>{
    console.log("Successfully listening on 7777")
});