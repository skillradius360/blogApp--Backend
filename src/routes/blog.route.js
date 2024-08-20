import {upload} from "../middlewares/multer.middleware.js"
import { addContentAndBackground } from "../controllers/blog.controller.js"
import Router from "express"

const blogRouter = Router()

blogRouter.route("/createBlog").post(upload.single("headerImages"),addContentAndBackground)



export {blogRouter}