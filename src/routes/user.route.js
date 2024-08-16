import Router from "express"
import { signUp,login,logOut } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { checkJWT } from "../middlewares/auth.middleware.js"
const userRouter = Router()

userRouter.route("/signUp").post(upload.fields([
    {name:"avatar", maxCount:1},
    {name:"coverImage", maxCount:1}
]),signUp)


userRouter.route("/login").post(login)
userRouter.route("/logOut").get(checkJWT,logOut)

export {userRouter}  