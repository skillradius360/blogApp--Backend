import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))
app.use(express.static("/public"))
app.use(express.json({
    limit:"16kb"}))

app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

import { userRouter } from "./routes/user.route.js"
app.use("/users",userRouter)

export {app}
