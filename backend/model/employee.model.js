import mongoose from "mongoose";
let employeeSchema = mongoose.Schema({

    userID:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"user",
        default:null, 
    },
    fullName:{
        type:String,
        required:true},
    city:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"City",
        default:null,
    },
    role:{
        type:String,
        enum:['cityManager',"admin","teamLead","worker"],
        required:true,},
    zone:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Zone",
        default:null,
    },
    skills:{
        type:[String],
        default:[],
    },
    address:{
        type:String,
        default:"",
    },
    contactNumber:{
        type:String,
        required:true,
    },
     CNIC:{
        type:String,
        required:true,
        unique:true,
    },
    joinedDate:{
        type:Date,
        default:null
    },
    leftDate:{
        type:Date,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    },
    DOB:{
        type:Date,
        default:null
    },
    education:{
        type:String,
        default:null
    } ,

},{ timestamps:true} );
let employeeModel = new mongoose.model("employee", employeeSchema);
export default employeeModel