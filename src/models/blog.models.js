import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    headerImages:{
        type:String,
        required:true
    },
    views:{
        type:Number,
    },
    heading:{
        type:String,
        uppercase:true
    },
    genre:{
        type:String,
        required:true
    }
},{
    timestamp:true
})


export const Blog= mongoose.model("Blog",blogSchema)