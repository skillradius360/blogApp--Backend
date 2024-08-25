import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Like } from "../models/likes.model.js";


const toggleLikes = asyncHandler(async (req,res)=>{

    const isBlogValid = await Like.findById(req.cookies.likeObj)
    if (!isBlogValid) {
        throw new apiError(400, "Blog not found")}
    
    if(isBlogValid.likedBy===null && isBlogValid.likedTo===null){
        isBlogValid.likedBy=req.user._id
        isBlogValid.likedTo=req.cookies.blogId
        await isBlogValid.save({validateBeforeSave:false})
    }
    else{
        isBlogValid.likedBy=null
        isBlogValid.likedTo=null
        await isBlogValid.save({validateBeforeSave:false})
    }
    return res.status(200).json(new apiResponse(200,isBlogValid,"Liked successfully!"))
})

export {toggleLikes}