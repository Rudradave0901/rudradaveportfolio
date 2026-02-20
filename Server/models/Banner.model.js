import mongoose from 'mongoose'

const BannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        headline: {
            type: String,
            required: true,
            trim: true,
        },
        designations: {
            type: [String],
            required: true,
        },
        bannerImageUrl: {
            type: String,
            required: true,
        },
        smallImageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    })

export const BannerModel = mongoose.model("BannerModel", BannerSchema);