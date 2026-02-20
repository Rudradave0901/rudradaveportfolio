import mongoose from "mongoose";

const ABoutSchema = new mongoose.Schema(
    {
        aboutContent : {
            type: String,
            required: true,
        },
        projectsDone : {
            type: Number,
            required: true,
        },
        yearsOfExperience : {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const AboutModel = mongoose.model("AboutModel", ABoutSchema);