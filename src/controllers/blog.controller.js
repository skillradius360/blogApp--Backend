import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { Blog } from "../models/blog.model.js"
import { isValidObjectId } from "mongoose"
import {cloudUploader} from "../utils/cloudinary.js"

const addContentAndBackground = asyncHandler(async (req, res) => {
    const { content, heading, genre } = req.body
    console.log(content, heading, genre)
    if ([content, heading, genre].some((data) => data.trim() === "")) {
        throw new apiError(400, "content or something not found")
    }

    const ifHeadingExists = await Blog.findOne({
        heading: heading
    })

    if (ifHeadingExists) {
        throw new apiError(400, "Same post with same heading exists")
    }
    const blogImage = req.file?.path
    if (!blogImage) {
        throw new apiError(400, "Blog image not found")
    }

    const uploadCloudBlogImg= await cloudUploader(blogImage)
    if (!uploadCloudBlogImg) {
        throw new apiError(400, "Blog image failed while being uploaded ")
    }

    const blogEntry = await Blog.create({
        content,
        heading,
        genre,
        headerImages: uploadCloudBlogImg?.url || "",
        owner: req.user._id,
    })

    if (!blogEntry) {
        throw new apiError(400, "blog creation unsuccessful")
    }

    const isBlogCreated = await Blog.findById(blogEntry._id)
    if (!isBlogCreated) {
        throw new apiError(401, "blog not found.CREATION FAILURE")
    }
    res.status(200).json(new apiResponse(200, isBlogCreated, " blog created successfully"))
})


const findAllBlogs = asyncHandler(async (req, res) => {
    const { username, quantity, page } = req.query

    if (!(genre || username)) {
        throw new apiError(400, "username or genre search query needed atleast")
    }
    if (quantity == undefined) {
        quantity = 10
    }

    const allBlogs = await User.aggregate([
        {
            $match: {
                _id: req.user._id
            }
        },
        {
            $lookup: {
                from: "Blog",
                localField: "_id",
                foreignField: "owner",
                as: "allBlogsOfUser"

            }
        }
    ])


    if (!allBlogs) {
        throw new apiError(404, "Blog data fetching failure")
    }

    const trending = Blog.aggregate([

        {
            $lookup: {
                from: "starred",
                localField: "_id",
                foreignField: "starredTo",
                as: "allStarred",

            }
        },
        {

            $sort: {
                "$allStarred.starredTo": -1
            }

        },
        

    ])
    if (!trending) {
        throw new apiError(404, "Trending data fetching failure")
    }
    const allDataForPage = allBlogs.slice((page*10) -9, page*10)
    return res.status(200).json(new apiResponse(200,
        {
            trendingData: trending,
            allDataAcpage:allDataForPage
        }))

})

const updateBlog= asyncHandler(async (req,res)=>{
    const {heading,content}= req.body
    const {blogId} = req.params
    
    if(!(heading && content)){
        throw new apiError(400, "no heading or content data recieved")
    }

    if(!isValidObjectId(blogId)){
        throw new apiError(400,"blogId invalid or does not exist")
    }
    const doesBlogExist = await Blog.findByIdAndUpdate(blogId,{
        $set:{
            heading:heading,
            content:content
        }
    },{new:true})

    if(!doesBlogExist){
        throw new apiError(400,"blogId invalid to update or not exists")
    }

    return res.status(200).json(new apiResponse(200,doesBlogExist,"Blog updatation successful!"))
})

const deleteBlog= asyncHandler(async (req,res)=>{
    const {blogId} = req.params

    if(!isValidObjectId(blogId)){
        throw new apiError(400,"blogId invalid or does not exist")
    }
    const doesBlogExist = await Blog.findByIdAndDelete(blogId)

    if(!doesBlogExist){
        throw new apiError(400,"blogId invalid to update or not exists")
    }

    return res.status(200).json(new apiResponse(200,doesBlogExist,"Blog deletion successful!"))
})

const updateImages = asyncHandler(async (req,res)=>{
    const {blogId}= req.params

    const blogObj= await Blog.findById(blogId)
    if(!blogObj){
        throw new apiError(400,"blog not found")
    }

    if(!isValidObjectId(blogId)){
        throw new apiError(400,"Blog Id not valid!")
    }

    const headImages = req.file?.headerImages[0]?.path
    if(!headImages){
        throw new apiError(400,"no header images recieved!")
    }

    const isUploaded= await cloudUploader(headImages)
    if(!isUploaded){
        throw new apiError(400,"header-Images not uploaded!")
    }

    const isSaved= blogObj.headImages=isUploaded?.url
    blogObj.save({validateBeforeSave:true})

    if(!isSaved){
        throw new apiError(400,"some problem occured while updating the photo")
    }

    res.status(200).json(new apiResponse(200,isSaved,"updated heading images success!"))
})


const findBlogsByGenre= asyncHandler(async(req,res)=>{
    const {genre} = req.params

    if(!genre){
        throw new apiError(400," genre fetch statement  invalid ")
    }

    const fetchedResult = await Blog.aggregate([
        {
          $match: {
            genre:"funny"
          }
        },
      
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as:"userData"
          }
        },
      ])



      if(!(Array.isArray(fetchedResult) || fetchedResult.length>0)){
        throw new apiError(400, "api fetch failure for specific genre")
      }
      res.status(200).json(new apiResponse(200,fetchedResult,"genre based fetched succecssfully"))
})

const findBlogsById= asyncHandler(async (req,res)=>{
    const {blogId} = req.params

    if(!req.user._id){
        throw new apiError(400,"login first")
    }

    if(!blogId){
        throw new apiError(400,"no blogId found")
    }
    const blogData =await Blog.findById(blogId)

    if(!blogData){
        throw new apiError(400,"no blogData")
    }
    res.status(200).json(new apiResponse(200,blogData,"blog data fetched successfully"))

})
export {
    addContentAndBackground,
    findAllBlogs,updateBlog,
    deleteBlog,
    updateImages,
    findBlogsByGenre,
    findBlogsById
}









    //    const accordToGenre = Blog.aggregate([
    //     {
    //         $group:{
    //             _id:genre,
    //             count:{
    //                 $sum:1
    //             }
    //         }
    //     }
    //    ])