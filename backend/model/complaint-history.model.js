import mongoose from "mongoose";

const ComplaintHistorySchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true
  },

  actionType: {
    type: String,
    enum: [
      "CREATED",
      "ASSIGNED",
      "REASSIGNED",
      "STATUS_CHANGED",
      "RESOLVED",
      "REJECTED"
    ],
    required: true
  },

  oldStatus: {
    type: String,
    enum: ["Pending", "Assigned", "In-Progress", "Resolved", "Rejected","Reassigned"],
    default: null
  },

  newStatus: {
    type: String,
    enum: ["Pending", "Assigned", "In-Progress", "Resolved", "Rejected","Reassigned"],
    required: true
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "team",
    default: null
  },

  actedBy: {
    type: mongoose.Schema.Types.ObjectId || null,
    ref: "user", // citizen / admin / employee
   
  },

  remarks: {
    type: String,
    default: ""
  }
}, { timestamps: true });
const ComplaintHistoryModel = mongoose.model("ComplaintHistory", ComplaintHistorySchema);
export default ComplaintHistoryModel;