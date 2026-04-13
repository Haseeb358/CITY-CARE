import mongoose from "mongoose";
import dotenv from "dotenv";
import ComplaintModel from "./model/complaint.model.js";
import ComplaintHistoryModel from "./model/complaint-history.model.js";

dotenv.config();

const updateStatuses = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Database connected for updating statuses");

    const complaints = await ComplaintModel.find().sort({ createdAt: -1 }).limit(5);

    if (complaints.length < 5) {
      console.log("Not enough complaints found");
      process.exit(1);
    }

    const updates = [
      { status: "Assigned", action: "ASSIGNED", remarks: "Assigned to team Alpha." }, // 0
      { status: "In-Progress", action: "STATUS_CHANGED", remarks: "Work has started on this issue." }, // 1
      { status: "Resolved", action: "RESOLVED", remarks: "Issue fixed successfully." }, // 2
      { status: "Rejected", action: "REJECTED", remarks: "Duplicate complaint, rejecting." }, // 3
      { status: "Resolved", action: "RESOLVED", remarks: "Awaiting final review." } // 4
    ];

    for (let i = 0; i < complaints.length; i++) {
      const complaint = complaints[i];
      const update = updates[i];

      const oldStatus = complaint.CurrentStatus || "Pending";

      complaint.CurrentStatus = update.status;
      await complaint.save();

      await ComplaintHistoryModel.create({
        complaint: complaint._id,
        actionType: update.action,
        oldStatus: oldStatus,
        newStatus: update.status,
        remarks: update.remarks,
        actedBy: complaint.complainant // using same as submitter just for dummy data
      });

      console.log(`Updated complaint ${complaint._id} to ${update.status}`);
    }

    console.log("Successfully updated 5 complaints with diverse statuses.");
    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    process.exit(1);
  }
};

updateStatuses();
