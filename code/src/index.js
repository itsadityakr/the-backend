// require("dotenv").config({ path: "./env" }); this is inconsitent as we are using import from statements of type modules so we will use
import dotenv from "dotenv";

import connectDB from "./db/index.js";

dotenv.config({
    path: "./env",
});

connectDB();
// Polluted Approach as doing eveything in index.js lets modularize it
/*
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

function connectDB() {}
connectDB(); bad apporach as we can use IIFE

()() IIFE
(() => {})() Arrow Function
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("ERROR", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Backend Running on Port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("ERROR: ", error);
        throw error;
    }
})(); 

*/
