import employeeModel from "../model/employee.model.js";

let authorizeRoles =  (...allowedRoles) => {
 return async (req, res, next) => {
  try {
    
    let {_id,role}=req.user;
    console.log("User role in authorizeRoles middleware: ", role);
    let employee = await employeeModel.findOne({ userID: _id });

    // 🚫 Citizens blocked here
      if (role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "Access denied Not an appropiate role",
        });
      }

    if (!employee || employee.isActive === false) {
        let error = new Error("Employee has no System Access or has inActive status");
        error.status = 404;
        return next(error);
    }
    if (!allowedRoles.includes(employee.role)) {
        let error = new Error("Access denied: Insufficient permissions");
        error.status = 403;
        return next(error);
    }
    next();

 } catch (error) {
    next(error);
 }
 }
};

export  {authorizeRoles};