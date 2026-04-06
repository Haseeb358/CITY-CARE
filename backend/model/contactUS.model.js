// name email message
import mongoose from "mongoose";

const contactUSSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
           
        },
        newsletter : {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);
const contactUSModel = mongoose.model("ContactUS", contactUSSchema);
export default contactUSModel;