import {app} from "./app.js"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"


dotenv.config({
    path:"./.env"
})

connectDB().then(()=>{
    app.listen(8000,()=>{
        console.log("express connected")
    })
}).catch((err)=>{
    console.log("the error occured is "+err)
})