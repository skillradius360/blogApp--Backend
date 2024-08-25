import Router from "express"
import { toggleLikes } from "../controllers/likes.controller.js"
import { checkJWT } from "../middlewares/auth.middleware.js"

const likeRouter = Router()

likeRouter.route("/toggleLike").get(checkJWT,toggleLikes)


export  {likeRouter}