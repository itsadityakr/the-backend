// product.models.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        description: {
            required: true,
            type: String,
        },
        name: {
            required: true,
            type: String,
        },
        productImage: {
            type: String,
        }, //SHould not store images,pdf,videos in buffer in mongo as it makes databse heavy insteead upload on diffrent local or cloud services and insert url
        price: {
            type: Number,
            default: 0,
        },
        stock: {
            default: 0,
            type: Number,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const product = mongoose.model("Product", productSchema);
