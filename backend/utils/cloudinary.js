import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_CLOUD_KEY,
  api_secret: process.env.CLOUDNARY_CLOUD_SECRET,
});

export default cloudinary;
