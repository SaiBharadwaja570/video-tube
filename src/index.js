// require('dotenv').config({path: './env'})
// import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constants";
// import express from 'express';

import { app } from './app.js';

import dotenv from 'dotenv';
import connectDB from "./db/indexdb.js";


dotenv.config({
    path: './env'
})

app.on('error', (error) => {
    console.error("Error:", error);
    throw error;
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Listening at port: ${process.env.PORT}`)
    })
})
.catch((err) => console.log("MONGODB connect failed: ", err))













// First approach ---- Everything in index
/*
// Using IIFE
(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", () =>{
            console.log("Error: ",  error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Listening at PORT: ${process.env.PORT}`)
        })
    }
    catch(err){
        console.error("ERROR: ", err);
    }
})() 
*/    