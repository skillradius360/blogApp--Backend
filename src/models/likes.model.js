import mongoose  from "mongoose";

const likeSchema = new mongoose.Schema({
    likedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    likedTo:{
        type:mongoose.Types.ObjectId,
        ref:"Blog"
    },
    blogTag:{
        type:mongoose.Types.ObjectId,
        ref:"Blog"
    }
},{
    timestamps:true
})


export const Like= mongoose.model("Like",likeSchema)