import fs from "fs";
import path from "path";
import { SkillsModel } from "../models/Skills.model.js";

// CREATE SKILLS DATA
export const createskillData = async (req, res) => {
    try {

        const skillImageURL = req.files?.skillImageURL ? `/uploads/skills/${req.files.skillImageURL[0].filename}` : undefined

        const getData = await SkillsModel.insertMany({
            skillName: req.body.skillName,
            skillContent: req.body.skillContent,
            skillUse: req.body.skillUse,
            skillImageURL
        });

        res.status(201).json({
            success: true,
            data: getData,
            message: "Data Created Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// GET SKILLS DATA
export const getSkillData = async (req, res) => {
    try {

        const getData = await SkillsModel.find()

        if (!getData || getData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no data found"
            })
        }

        res.status(200).json({
            success: true,
            data: getData,
            message: "Data Fetched Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal srver error"
        })
    }
}

export const updateskillData = async (req, res) => {
    try {
        const { id } = req.params;
        const existingSkill = await SkillsModel.findById(id);

        if (!existingSkill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        let skillImageURL = existingSkill.skillImageURL;

        if (req.files?.skillImageURL) {
            // Delete old image
            if (existingSkill.skillImageURL) {
                const oldImagePath = path.join(
                    process.cwd(),
                    existingSkill.skillImageURL.replace(/^\/+/, "")
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            skillImageURL = `/uploads/skills/${req.files.skillImageURL[0].filename}`;
        }

        const updatedSkill = await SkillsModel.findByIdAndUpdate(
            id,
            {
                skillName: req.body.skillName || existingSkill.skillName,
                skillContent: req.body.skillContent || existingSkill.skillContent,
                skillUse: req.body.skillUse || existingSkill.skillUse,
                skillImageURL,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedSkill,
            message: "Skill updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =============================================== //
//      DELETE SKILLS DATA CODE START              //
// =============================================== //


// DELETE SKILLS DATA (Delete 1 Data at a time)
export const deleteSkillData = async (req, res) => {
    try {

        const { id } = req.params;

        const getDataID = await SkillsModel.findById(id);

        if (!getDataID) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // 2️⃣ Delete image if exists
        if (getDataID.skillImageURL) {
            const imagePath = path.join(
                process.cwd(),
                getDataID.skillImageURL.replace(/^\/+/, "")
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3️⃣ Delete DB record
        await SkillsModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Data Deleted Successfully",
            // data: getDataID
        })

    } catch (error) {
        console.log("cicnjdvuidnhvudnvudvf", error);

        res.status(500).json({
            success: false,
            message: error
        })
    }
}


// DELETE SKILLS DATA (Delete many Data at a time)
export const deleteManySkillData = async (req, res) => {
    try {


        const { ids } = req.body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Skill IDs are required",
            });
        }

        const getDataID = await SkillsModel.deleteMany({
            _id: { $in: ids },
        })

        res.status(200).json({
            success: true,
            message: "Data Deleted Successfully",
            data: getDataID,
            deletedCounts: getDataID.deletedCounts,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal srver error"
        })
    }
}


// DELETE SKILLS DATA (Delete all Data at a time)
export const deleteAllSkillData = async (req, res) => {
    try {

        const deleteAllData = await SkillsModel.deleteMany({});
        res.status(200).json({
            success: true,
            message: "all Data Deleted Successfully",
            data: deleteAllData,
            deletedCounts: deleteAllData.deletedCounts
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal srver error"
        })
    }
}
// =============================================== //
//      DELETE SKILLS DATA CODE END                //
// =============================================== //