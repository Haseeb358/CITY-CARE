import mongoose from "mongoose";
let complainantSchema = mongoose.Schema({

    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    fullName:{
        type:String,
        required:true,}
        ,
    contactNumber:{
        type:String,
        required:true,},
    currentLatitude:{
        type:Number,
        default:null
    },
    currentLongitude:{
        type:Number,
        default:null},
   
}
    , { timestamps:true}
);

let complainantModel =new mongoose.model("complainant",complainantSchema);

export default complainantModel;