import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {User} from "../models/user.model.js"


const addContentAndBackground= asyncHandler(async (req,res)=>{
        const {content,heading,genre} =req.body

        if(![content,heading,genre].some((data)=>data.trim()==="")){
            throw new apiError(400,"content or something not found")
    }

})