import { eduExpMpdel } from "../models/EduExp.model.js";

export const createEduExpData = async (req, res) => {
    try {
        const getData = await eduExpMpdel.create(req.body);
        res.status(201).json({
            success: true,
            data: getData
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to create data"
        });
    }
}

export const getEduExpData = async (req, res) => {
    try {
        const getData = await eduExpMpdel.find();
        res.status(200).json({
            success: true,
            data: getData
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data"
        });
    }
}

export const updateEduExpData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await eduExpMpdel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedData,
            message: "Data updated successfully"
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to update data"
        });
    }
}

export const deleteEduExpData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await eduExpMpdel.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data deleted successfully"
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete data"
        });
    }
}