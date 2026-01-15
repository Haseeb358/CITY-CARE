
import mongoose from "mongoose";

let ComplaintSchema= new mongoose.Schema({
     complainant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "complainant",
        required: true
     },
     category:{
        type: String,
        required: true
     },
     city:{
       type:String || mongoose.Schema.Types.ObjectId,
       required:true
     },
     zone:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Zone",
        required:true
     },
     description:{
        type: String,
        required: true
     },
   location: {
    type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true,
  },
},
     CurrentStatus:{
        type: String,
        enum: ["Pending", "In-Progress", "Resolved", "Rejected","Assigned","Review"],
        default: "Pending"
    },
    media:
    {
      ByUser:{
        publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      },
      byTeamLead:{
        publicId: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
      },

    },
 votes: {
  type: Number,
  default: 0,
},
votesBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "complainant",
}],
assignedTeam: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "team",
  default: null,
},
outOfServiceZone:{
  type: Boolean,
  default: false,
}
  
  
} ,{timestamps: true});

ComplaintSchema.index({ location: "2dsphere" });

const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
export default ComplaintModel;