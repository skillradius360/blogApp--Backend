import {upload} from "../middlewares/multer.middleware.js"
import { addContentAndBackground ,findBlogsByGenre,findBlogsById} from "../controllers/blog.controller.js"
import { checkJWT } from "../middlewares/auth.middleware.js"
import { likeCreation} from "../middlewares/like.middleware.js"

import Router from "express"

const blogRouter = Router()

blogRouter.route("/createBlog").post(checkJWT, upload.single("headerImages"),addContentAndBackground)
blogRouter.route("/genres/:genre").get(checkJWT,findBlogsByGenre)
blogRouter.route("/find/:blogId").get(checkJWT,likeCreation,findBlogsById)




export {blogRouter}