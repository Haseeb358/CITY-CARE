import City from "../model/city.model.js";
import Zone from "../model/zone.model.js";





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



export { createCity };

