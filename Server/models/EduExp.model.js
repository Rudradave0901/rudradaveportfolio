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
            description: {
                type: [String],
                required: true
            },
        }],
        experience: [{
            designation: {
                type: String,
                required: true
            },
            companyName: {
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
            description: {
                type: [String],
                required: true
            },
        }]

    },
    {
        timestamps: true
    }
);

export const EduExpModel = mongoose.model("EduExp", eduExpSchema);