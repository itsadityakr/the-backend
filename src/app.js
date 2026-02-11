const express = require("express");
require("dotenv").config();

const app = express();
const multer = require("multer");
const uploadFile = require("./services/storage.services");
const postModel = require("./models/post.model");

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/create-post", upload.single("image"), async (req, res) => {
    const result = await uploadFile(req.file.buffer);

    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption,
    });

    res.status(201).json({ message: "Post created successfully", post });
});

app.get("/post", async (req, res) => {
    const post = await postModel.find();

    res.status(200).json({
        message: "Post fetched successfully",
        post,
    });
});

module.exports = app;
