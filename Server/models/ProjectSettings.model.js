import mongoose from "mongoose";

const projectSettingsSchema = mongoose.Schema(
    {
        maxProjectsLimit: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const projectSettingsModel = mongoose.model("projectSettings", projectSettingsSchema);
