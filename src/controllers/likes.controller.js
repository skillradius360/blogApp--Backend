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

const getAllLikedVlogs= asyncHandler(async (req,res)=>{

    if(!req.user._id){
        throw new apiError(400,"please login brfore accessing liked Videos")
    }
    const filterLiked = await User.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "likedBy",
            as: "vlogsLiked",
            pipeline: [
             
              {
                $lookup: {
                  from: "blogs",
                  foreignField: "_id",
                  localField: "likedTo",
                  as: "vlogData",
                       
                },
              },
            ],
          },
        },
       {
                $project:{
                  vlogsLiked:1
                }
              },
      ])
    if(filterLiked?.length<=0){
        throw new apiError(401,"no liked blogs detected!")
    }

    res.status(200).json(new apiResponse(200,filterLiked[0],"vlogs fetched success"))
})

const getAllLikers= asyncHandler(async (req,res)=>{
        const result = User.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(req.user._id)}
            },

         {   $lookup:{
                from:"blogs",
                localField:"_id",
                foreignField:"owner",
                as:"allUserBlogs",
                pipeline:[
                    {
                        $lookup:{
                            from:"likes",
                            localField:"_id",
                            foreignField:"likedTo"
                        }
                    }
                ]
            }
        }
        ])
})
export {toggleLikes,getAllLikedVlogs}