// require("dotenv").config({ path: "./env" }); this is inconsitent as we are using import from statements of type modules so we will use
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed !!! ", error);
    });
