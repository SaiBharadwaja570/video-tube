import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary service url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary service url
    },
    watchHistory:[ 
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type: String
    }
}, {
    timestamps: true
}
)

// encrypting data
userSchema.pre("save", async function (next) {
    // run for the time when there is a change in password only
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// custome methods
userSchema.methods.isPasswordCorrect = async function(password){
    return await  bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname
},
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
} 
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    } 
    )
}

export const User = mongoose.model("User", userSchema);