import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        qualifications: {
            type: String,
            required: true,
        },
        experienceInYears: {
            type: number,
            required: true,
            default: 0,
        },
        worksInHospitals: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
        ],
        age: {
            type: String,
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: true,
        },
    },
    { timestamps: true }
);

export const doctor = mongoose.model("Doctor", doctorSchema);
