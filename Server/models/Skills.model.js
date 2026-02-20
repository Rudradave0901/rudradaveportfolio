import mongoose from "mongoose";

const skillsSchema = mongoose.Schema(
    {
        skillContent: {
            type: String,
            required: true
        },
        skillName: {
            type: String,
            required: true
        },
        skillUse: {
            type: String,
            required: true
        },
        skillImageURL: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const SkillsModel = mongoose.model("SkillsModel",skillsSchema)