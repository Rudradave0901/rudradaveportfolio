import { AboutModel } from "../models/About.model.js";

// CREATE ABOUTDATA CONTROLLER
export const createAboutData = async (req, res) => {
    try {
        let aboutData = await AboutModel.findOne();
        if (aboutData) {
            return res.status(400).json({
                success: false,
                message: "about Data is already created"
            });
        }

        aboutData = await AboutModel.create(req.body)
        res.status(201).json({
            success: true,
            data: aboutData,
            message: "About Data Created Successfully"
        });

    } catch (error) {
        console.log("Error Creating About Data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// GET ABOUT DATA
export const getAboutData = async (req, res) => {
    try {
        const aboutData = await AboutModel.findOne();

        if (!aboutData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        res.status(200).json(
            {
                success: true,
                data: aboutData
            }
        );
    } catch (error) {
        console.error("Error fetching About data:", error);
        res.status(500).json(
            {
                success: false,
                message: "Server Error"
            }
        );
    }
};

// UPDATE ABOUT DATA
export const updateAboutData = async (req, res) => {
    try {
        const aboutData = await AboutModel.findOneAndUpdate({}, req.body, { new: true });

        if (!aboutData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        res.status(200).json({
            success: true,
            data: aboutData,
            message: "About Data Updated Successfully"
        });

    } catch (error) {
        console.log("Error Updating About Data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


// DELETE ABOUT DATA
export const deleteAboutData = async (req, res) => {
    try {
        const aboutData = await AboutModel.findOne();

        if (!aboutData) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            });
        }

        await AboutModel.deleteOne();
        res.status(200).json({
            success: true,
            message: "Data Deleted Successfully"
        })


    } catch (error) {
        console.log("internal server error : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}