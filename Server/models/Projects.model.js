import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
        },
        projectImageURL: {
            type: String,
            required: true,
        },
        projectURL: {
            type: String,
            required: true,
        },
        stack: {
            frontend: {
                type: [String],
                required: true,
            },
            backend: {
                type: [String],
                required: true,
            },
            tools: {
                type: [String],
                required: true,
            },
            tags: {
                type: [String],
                required: true,
            }
        }
    },
    {
        timestamps: true
    }
);

projectSchema.index({ createdAt: -1 });

export const projectsModel = mongoose.model("projectsModel", projectSchema);