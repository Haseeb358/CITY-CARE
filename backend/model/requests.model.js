import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    required: true
  },

  fromTeamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true
  },

  toCityManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true
  },

  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },

  status: {
    type: String,
    enum: ["Sent", "Accepted", "Rejected"],
    default: "Sent"
  },

  remarks: {
    type: String, // City Manager response
    default: ""
  }

}, { timestamps: true });

const RequestModel = mongoose.model("Request", requestSchema);
export default RequestModel;