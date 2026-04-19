// services/media.service.js
import fs from "fs";
import path from "path";

import cloudinary from "./cloudinary.js";

export let uploadMedia = async (files) => {
     let uploaded = [];
  try {
    

  if ( files.length === 0) {
    // https://res.cloudinary.com/drydjzval/image/upload/v1776549801/ComplaintMedia/uofcremfv8ea5evgusv2.jpg
    uploadMedia=[{
      publicId: "ComplaintMedia/default-placeholder",
      url: "https://res.cloudinary.com/drydjzval/image/upload/v1776549801/ComplaintMedia/uofcremfv8ea5evgusv2.jpg"
    }]
    return uploadMedia;
  }

  for (let file of files) {
    const tempPath = path.resolve("uploads", file.originalname);
    fs.writeFileSync(tempPath, file.buffer);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "ComplaintMedia",
      resource_type: "auto"
    });

    uploaded.push({
      publicId: result.public_id,
      url: result.secure_url
    });

    fs.unlinkSync(tempPath);
  }
  console.log("Uploaded media: ", uploaded);
  return uploaded;
    
  } catch (error) {
    throw error;
  }
};
