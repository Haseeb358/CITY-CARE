// services/media.service.js
import fs from "fs";
import path from "path";

import cloudinary from "./cloudinary.js";

export const uploadMedia = async (files) => {
  try {
    const uploaded = [];

  if (!files || files.length === 0) {
    throw new Error("No files to upload");
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

  return uploaded;
    
  } catch (error) {
    throw error;
  }
};
