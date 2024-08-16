import {mongoose}  from "mongoose";
import {DB_NAME} from "../constants.js"
import { app } from "../app.js";



async function connectDB(){
    try {
        const response = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        app.on("error",(err)=>{
            console.log("some error occured while connecting to the db   "+err)
        })
        console.log("the server started at DB URI"+response.connection.host)
    } catch (error) {
        console.log("error occured",error)
    }
}

export {connectDB}