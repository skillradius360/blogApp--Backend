import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
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

blogSchema.plugin(mongooseAggregatePaginate)
export const Blog= mongoose.model("Blog",blogSchema)