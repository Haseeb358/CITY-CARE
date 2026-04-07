import City from "../model/city.model.js";
import Zone from "../model/zone.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import userModel from "../model/user.model.js";
import employeeModel from "../model/employee.model.js";


let createCity = async (req, res,next) => {
    try {
        const { name, province } = req.body;

        const existingCity = await City.findOne({ name: name });
        if (existingCity) {
            let error = new Error("City with this name already exists");
            error.status = 400;
           return next(error);
        }
        const city = new City({ name, province });
        await city.save();
        res.status(201).json({ success: true, message: "City created successfully", city: city });

    } catch (error) {
        next(error);
    }
};
let complaintCategories = async (req, res, next) => {

  try {
     let cat=req.body.category;
     let existingCategory = await ComplaintCategoryModel.findOne({name:cat});
     if(existingCategory){
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
     }
     let category = new ComplaintCategoryModel({
        name: cat
     })
     await category.save();
     res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: category
     })
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
    let cityRecord = await cityModel.findOne({ name: city });
    if (!cityRecord) {
      let error = new Error("City not found");
      error.status = 400;
      return next(error);
    }
    let newEmployee = new employeeModel({
        fullName,city:cityRecord._id,role,zone,skills,address,contactNumber,CNIC,joinedDate,DOB,education,

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

export { createCity, complaintCategories, getAllUsers, createEmployeeRecord };

