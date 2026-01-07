import mongoose from "mongoose";
import userModel from "../model/user.model.js";
import complainantModel from "../model/complainant.model.js";
import employeeModel from "../model/employee.model.js";
import bcrypt from "bcrypt";
import sendToken_Cookie from "../utils/JWT-Cookies.js";
import sendEmail from "../utils/email.js";

let registerUser = async (req, res,next) => {
 
    try {
        let { email, passwordHash, fullName, contactNumber, currentLatitude, currentLongitude, } = req.body;
        let userExisted = await userModel.findOne({ email: email });
        if (userExisted) {
            let error = new Error("User already exists with this email");
            error.status = 400;
            return next(error);
        }   
        let hashedPassword = await bcrypt.hash(passwordHash, 10);
        let otp=Math.floor(100000 + Math.random() * 900000).toString();
        let otpExpiry= Date.now() + 1000 * 60 * 20; // 20 minute from now
        console.log("OTP IS: ",otp);
        // Create User
        let newUser = new userModel({
            email: email,
            passwordHash: hashedPassword,
            otp:otp,
            otpExpiry:otpExpiry,
        });
        
        let savedUser = await newUser.save();
        // Create Complainant
        let newComplainant = new complainantModel({
            userID: savedUser._id,
            fullName: fullName,
            contactNumber: contactNumber,
            currentLatitude: currentLatitude,
            currentLongitude: currentLongitude,
        });
        let savedComplainant = await newComplainant.save();
        // let mailOptions = {
        //     to: savedUser.email,
        //     subject: "CityCare - Verify your email",
        //     name : newComplainant.fullName,
        //     otp : otp,
        // }
        //  await sendEmail(mailOptions); 
       
        res.status(201).json(
            {
                success: true,
                message: "User registered successfully",
                data: {_id: savedUser._id, email: savedUser.email, fullName: savedComplainant.fullName,contactNumber:savedComplainant.contactNumber,currentLatitude:savedComplainant.currentLatitude,currentLongitude:savedComplainant.currentLongitude  },
            }
        )


    } catch (error) {
         next(error);
    }

}

let verifyOtp = async (req, res,next) => {
    try {

        let { email, otp } = req.body;
        let user = await userModel.findOne({ email: email });
        if (!user) {
            let error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        if (user.otp !== otp) {
        let error = new Error("Invalid otp");
        error.status = 400;
        return next(error);
      } else if (user.otpExpiry < Date.now()) {
        let error = new Error("otp time is expired");
        error.status = 400;
        return next(error);
      } else {
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User is Verified SuccessFully",
        });
      }
    } catch (error) {
        next(error);
    }
}

let loginUser = async (req, res,next) => {

    try {

        let { email, passwordHash } = req.body;
        let user = await userModel.findOne({ email: email });
        if (!user) {
            let error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        if (!user.isVerified) {
            let error = new Error("User is not verified");
            error.status = 400;
            return next(error);
        }
        let isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isPasswordValid) {
            let error = new Error("Invalid password");
            error.status = 400;
            return next(error);
        }
      
        let data = {
            _id: user._id,
            role: user.role,
            email: user.email,   
        }
        sendToken_Cookie(data, 200, res, "Login Successful");  
    } catch (error) {
        next(error);
    }

}

let getAllUsers = async (req, res,next) => {
    try {
        let users = await userModel.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

let createEmployeeRecord = async (req, res,next) => {

    try {

    const {
      fullName,
      city,
      role,
      zone,
      skills,
      address,
      contactNumber,
      CNIC,
      joinedDate,
      DOB,
      education,

    } = req.body;

    let employeeExists = await employeeModel.findOne({ CNIC: CNIC });
    if (employeeExists) {
      let error = new Error("Employee already exists");
      error.status = 400;
      return next(error);
    }

    let newEmployee = new employeeModel({
        fullName,city,role,zone,skills,address,contactNumber,CNIC,joinedDate,DOB,education,

    })
    let savedEmployee = await newEmployee.save();
    res.status(201).json({
        success: true,
        message: "Employee record created successfully",
        data: savedEmployee,
    });
 
    } catch (error) {
        next(error);
    }

};

let assignLoginToEmployee = async (req, res,next) => {

    try {
        let { email,passwordHash } = req.body;
        let { employeeId } = req.params; // get _id frm employee model
        if(!mongoose.Types.ObjectId.isValid(employeeId)){
            let error = new Error("Invalid employee ID");
            error.status = 400;
            return next(error);
        }
        let employee = await employeeModel.findById(employeeId);
        if (!employee) {
            let error = new Error("Employee not found for the given ID");
            error.status = 404;
            return next(error);
        }
       
        if(employee.userID){
            let error = new Error("Login already assigned to this employee");
            error.status = 400;
            return next(error);
        }
        let userExisted = await userModel.findOne({ email: email });
        if (userExisted) {
            let error = new Error("User already exists with this email");
            error.status = 400;
            return next(error);
        }
        let hashedPassword = await bcrypt.hash(passwordHash, 10);
        let newUser = new userModel({
            email: email,
            passwordHash: hashedPassword,
            role:"employee",
            isVerified:true,
        });
        let savedUser = await newUser.save();
    
        employee.userID = savedUser._id;
        await employee.save();
        res.status(200).json({
            success: true,
            message: "Login assigned to employee successfully",
            data: { userId: savedUser._id, email: savedUser.email, fullName: employee.fullName },
        });
        
    } catch (error) {
        next(error);
    }

}

let logOutUser = async (req, res,next) => {
    try {
        res.cookie("token", "", {
      expire: new Date(Date.now()),
      httpOnly: true,
      sameSite: "Strict",
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
    } catch (error) {
        next(error);
    }
};


export { registerUser , verifyOtp,loginUser,getAllUsers,createEmployeeRecord,assignLoginToEmployee,logOutUser};