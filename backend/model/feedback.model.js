import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({

    complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "complaint",
        required: true
    },
    complainant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "complainant",
        required: true
    },
    text: {
        type: String,
        required: true 
    }, 
    rating: {
        type: Number,
        required: true,},


},{ timestamps: true });

const FeedbackModel = mongoose.model("feedback", feedbackSchema);
export default FeedbackModel;