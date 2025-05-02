import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false})


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation
    // already exists? --- username, email
    //check for images and avatar 
    // upload to cloudinary, avatar
    // create user object - create entry in db
    // remive password and remove refresh token field from response
    // check for user creation
    // return response
    console.log("Request body: ", req.body);

    const {fullname, email, username, password} = req.body
    console.log("email: ", email); 

    // validation
    if ([fullname, email, username, password].some(field => field?.trim() ==="")) {
        throw new ApiError(400, "All fields are requied")
    }

     // already exists?
    const existedUser=await User.findOne({
        $or: [{ username }, { email }]
     })

     if(existedUser){
        console.log("existedUser:" , existedUser);
        throw new ApiError(409, "User already exists");
    }

    console.log(req.files);

    //check for images and avatar

    // -- multiple files present 
    console.log("req.files: " ,req.files);
    const avatarLocalPath= req.files?.avatar[0]?.path
    // const coverImageLocalPath  = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar Required");
    }

    const avatar =   await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); 

    if(!avatar){
        throw new ApiError(400, "Avatar Required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfuly!!!")

    ) 


} )


// login

const loginUser = asyncHandler(async (req, res) => {
    // my todos
    // 1. validations
    // 2. compare tokens
    // 3. does user exists?
    // 4. authenticate and authorize

    // todos
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token given
    // send cookies 

    const {email, username, password} = req.body;
    if(!username || !email){
        throw new ApiError(400, "Username or password required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}] 
    })

    if (!user) {
        throw new ApiError(404, "The user does not exist!")
    }

    const isPassValid = await user.isPasswordCorrect(password)

    if (!isPassValid) {
        throw new ApiError(401, "The user does not exist!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
})


const logoutUser = asyncHandler(async(req, res) => {
    
    // steps: clear cookies
        


})

export { registerUser, loginUser, logoutUser }