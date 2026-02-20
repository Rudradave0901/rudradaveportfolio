import { BannerModel } from "../models/Banner.model.js";


// CREATE BANNER DATA
export const createBanner = async(req, res) => {
    try {
        const existingBanner = await BannerModel.findOne();

        if(existingBanner) {
            return res.status(400).json({
                success: false,
                message: "Banner Data Already Exists"    
            })
        }        

        if (!req.files?.BannerImage || !req.files?.smallBannerImage) {
            return res.status(400).json({
                success: false,
                message: "Both images are required"
            })
        }

        const bannerImageUrl = `/uploads/banners/${req.files.BannerImage[0].filename}`;
        const smallImageUrl = `/uploads/banners/${req.files.smallBannerImage[0].filename}`;

        const banner = await BannerModel.create({
            name: req.body.name,
            headline: req.body.headline,
            designations: JSON.parse(req.body.designations),
            bannerImageUrl,
            smallImageUrl
        });

        res.status(201).json({
            success: true,
            message: "Banner Data added sucessfully",
            data: banner
        })


    } catch (error) {
        console.log("Error :- ", error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
}


// GET BANNER DATA
export const getBannerData = async (req, res) => {
    try {
        const banner = await BannerModel.findOne(); 

        if(!banner) {
            return res.status(404).json({
                success: false,
                message: "no data found in Banner"
            })
        }

        res.status(200).json({
            success: true,
            message: "Banner data is fatched",
            data: banner
        })

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// DELETE BANNER DATA
export const deleteBanner = async (req, res) => {
    const existingBanner = await BannerModel.findOne();

    if (!existingBanner) {
        return res.status(404).json({
            success: false,
            message: "no data found in Banner"
        })
    }

    const deleteBanner = await BannerModel.deleteOne();
    res.status(200).json({
        success: true,
        message: "Banner Data deleted successfully",
        data: deleteBanner
    })
};


export const updateBanner = async (req, res) => {
  try {
    const banner = await BannerModel.findOne();
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    // update text
    banner.name = req.body.name || banner.name;
    banner.headline = req.body.headline || banner.headline;
    banner.designations = JSON.parse(req.body.designations);

    // update images if new ones uploaded
    if (req.files?.BannerImage) {
        console.log("comes in BannerImage");
        
      banner.bannerImageUrl =
        `/uploads/banners/${req.files.BannerImage[0].filename}`;
    }

    if (req.files?.smallBannerImage) {
        console.log("comes in smallBannerImage");
        
      banner.smallImageUrl =
        `/uploads/banners/${req.files.smallBannerImage[0].filename}`;
    }

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);


    await banner.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner
    });

  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ success: false, message: "Failed to update banner" });
  }
};
