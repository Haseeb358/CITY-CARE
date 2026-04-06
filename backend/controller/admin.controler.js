import City from "../model/city.model.js";
import Zone from "../model/zone.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";


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


export { createCity, complaintCategories };

