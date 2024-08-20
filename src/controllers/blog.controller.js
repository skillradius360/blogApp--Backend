import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.model.js"
import {Blog} from "../models/blog.model.js"


const addContentAndBackground= asyncHandler(async (req,res)=>{
        const {content,heading,genre} =req.body

        if(![content,heading,genre].some((data)=>data.trim()==="")){
            throw new apiError(400,"content or something not found")
    }

    const ifHeadingExists = await Blog.findOne({
        heading:heading
    })

    if(!ifHeadingExists){
        throw new apiError(400,"Same post with same heading exists")
    }

const blogImage = req.file?.headerImages[0]?.path
if(!blogImage){
    throw new apiError(400,"Blog image not found")
}

const blogEntry =await  Blog.create({
    content,
    heading,
    genre,
    headerImages:blogImage,
    owner:req.user._id,
})

if(!blogEntry){
    throw new apiError(400,"blog creation unsuccessful")
}

const isBlogCreated=await Blog.findById(blogEntry._id)
if(!isBlogCreated){
    throw new apiError(401,"blog not found.CREATION FAILURE")
}
res.status(200).json(new apiResponse(200,isBlogCreated," blog created successfully"))
})


const findAllBlogs= asyncHandler(async (req,res)=>{
    const {genre,username,quantity,page}= req.query

    if(!(genre || username )){
        throw new apiError(400,"username or genre search query needed atleast")
    }
    if(quantity==undefined){
        quantity=10
    }

   const allBlogs = await  User.aggregate([
       {
         $match:{
            _id:req.user._id
        }
        },
        {
            $lookup:{
                from:"Blog",
                localField:"_id",
                foreignField:"owner",
                as:"allBlogsOfUser"

            }
        }
   ])

   const accordToGenre = Blog.aggregate([
    {
        $groupBy:{
            genre
        }
    }
   ])


})
export {addContentAndBackground}