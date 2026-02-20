import mongoose from "mongoose";

const eduExpSchema = mongoose.Schema(
    {
        education: [{
            courseName: {
                type: String,
                required: true
            },
            instituteName: {
                type: String,
                required: true
            },
            startDate: {
                type: String,
                required: true
            },
            endDate: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            discription: {
                type: [String],
                required: true
            },
        }],
        experince: [{
            designation: {
                type: String,
                required: true
            },
            compenyName: {
                type: String,
                required: true
            },
            startDate: {
                type: String,
                required: true
            },
            endDate: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            discription: {
                type: [String],
                required: true
            },
        }]

    },
    {
        timestamps: true
    }
);

export const eduExpMpdel = mongoose.model("eduExpMpdel", eduExpSchema)