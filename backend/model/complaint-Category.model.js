import mongoose from "mongoose";

let ComplaintCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isActive:{
        type: Boolean,
        default: true
    }

})
const ComplaintCategoryModel = mongoose.model("ComplaintCategory", ComplaintCategorySchema);
export default ComplaintCategoryModel;