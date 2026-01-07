import mongoose  from "mongoose";   

let userSchema = mongoose.Schema({
   
    email:{
        type:String,
        required:true,
        unique:true,
    },
    passwordHash:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['citizen','employee'],
        default:'citizen',
        
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpiry:{
        type:Date,
        default:null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiryDate: {
      type: String,
      default: null,
    },
     
},
   { timestamps:true} 
);

let userModel =new mongoose.model("user",userSchema);
export default userModel;