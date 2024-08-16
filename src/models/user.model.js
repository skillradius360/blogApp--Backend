import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,

    },
    avatar: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

// *****************************************************************

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password= await bcrypt.hash(this.password,8)
    next()
})

userSchema.methods.checkPassword= async function(password){
    if(!password){
        throw new Error("no password recieved")
    }
    const isPasswordCorrect= await bcrypt.compare(password,this.password)
    return isPasswordCorrect
}

userSchema.methods.generateAccessToken= function(){
    return  jwt.sign({
        _id:this._id,
        username:this.username
    },process.env.ACCESS_TOKEN_SECRET
    ,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET
    ,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
}



export const User = mongoose .model("User",userSchema)