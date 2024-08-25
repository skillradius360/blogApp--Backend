import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Like } from "../models/likes.model.js";




const likeCreation = asyncHandler(async(req,res,next)=>{
    const {blogId}= req.params
    if (!blogId) {
        throw new apiError(400, "no blog ID recieved")
    }
    const BlogExists= await Blog.findById(blogId)

    if (!BlogExists) {
        throw new apiError(400, "no blog found")
    }

    const blogConnection= await Like.findOne({
        blogTag:BlogExists._id
    })

    const Options= {httpOnly:true,
        secure:true
    }

    if(!blogConnection){       
            
        const likeObj= await Like.create({
            blogTag:BlogExists._id,
            likedTo:null,
            likedBy:null
        },
        {timestamps:true})
    
        console.log(likeObj)
        if(!likeObj){
            throw new apiError(400,"likeBox not created")
        }
        res.cookie("blogId",BlogExists._id,Options).cookie("likeObj",likeObj[0]._id,Options)
        next()

        }

    else{
        res.cookie("blogId",blogId,Options)
            next()
    }

})
    

// const likeObj= await Like.create({
//     blogTag:BlogExists._id,
//     likedTo:null,
//     likedBy:null
// },
// {timestamps:true})

// console.log(likeObj)
// if(!likeObj){
//     throw new apiError(400,"likeBox not created")
// }
// res.cookie("blogId",BlogExists._id,Options).cookie("likeObj",likeObj[0]._id,Options)
// next()




export {likeCreation}


// create a blog-- form a like injection -- 