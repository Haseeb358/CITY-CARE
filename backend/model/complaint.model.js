
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
       type:mongoose.Schema.Types.ObjectId,
       ref:"City",
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
  
  CurrentStatus: {
    type: String,
    enum: ["Pending", "In-Progress", "Resolved", "Rejected", "Assigned", "Review"],
    default: "Pending"
  },
  
    media:[]
    ,
    resolvedMedia:{
      type: [Object], // Array of objects containing media details (e.g., URL, type)
      default: []
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
},
addressDescription:{
  type: String,
  default: ""
},
  
},{timestamps: true}
);

ComplaintSchema.index({ location: "2dsphere" });

const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
export default ComplaintModel;