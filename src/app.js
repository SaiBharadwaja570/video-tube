import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) 
app.use(express.json({
    limit: "16kb"
}))
// To solve url issues:
app.use(express.urlencoded({extended: true, limit: "16kb"}))
//public assets -- to sore in my server
app.use(express.static("public"))
// to perform crud option on users cookies
app.use(cookieParser())

// routes import

import userRouter from './routes/user.routes.js';


// routes declaration

// after user all the methods will be passed using userRouter
app.use("/api/v1/users", userRouter)

export {app}