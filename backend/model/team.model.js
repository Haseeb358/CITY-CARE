import mongoose from "mongoose";

let teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    leader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true
        
    },
    zone:{
        type: mongoose.Schema.Types.ObjectId || null,
        ref: "Zone",  
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId || null, 
        ref: "employee"
    }],
    isActive:{
        type: Boolean,
        default: true
    },
    

},{timestamps: true});

let teamModel = mongoose.model("team", teamSchema);
export default teamModel;