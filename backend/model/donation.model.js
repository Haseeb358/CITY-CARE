import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId || null,
    ref: "user",
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  donatedAt: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: String,
    unique: true,
},
});

const donationModel = mongoose.model("donation", donationSchema);
export default donationModel;