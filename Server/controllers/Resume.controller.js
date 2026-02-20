import { ResumeModel } from "../models/resume.model.js";

/* =========================
   CREATE RESUME (ADMIN)
========================= */
export const createResume = async (req, res) => {
  try {
    // Only one resume allowed (like banner)
    const existingResume = await ResumeModel.findOne();

    if (existingResume) {
      return res.status(400).json({
        success: false,
        message: "Resume already exists",
      });
    }

    const resume = await ResumeModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Create Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET RESUME (PUBLIC)
========================= */
export const getResume = async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({ isActive: true });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
      console.error("Get Resume Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
  }
};




export const deleteResume = async (req, res) => {
    const existingResume = await ResumeModel.findOne();

    if (!existingResume) {
        return res.status(404).json({
            success: false,
            message: "no data found in Resume"
        })
    }

    const deleteResume = await ResumeModel.deleteOne();
    res.status(200).json({
        success: true,
        message: "Resume Data deleted successfully",
        data: deleteResume
    })
};














export const updateResume = async (req, res) => {
  try {
    const updatedResume = await ResumeModel.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};