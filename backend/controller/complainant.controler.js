import complainantModel from "../model/complainant.model.js";
import ComplaintModel from "../model/complaint.model.js";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";
import Zone from "../model/zone.model.js";
import path from "path";
import fs from "fs";
import CityModel from "../model/city.model.js";
import { autoAssignTeam } from "../utils/autoAssignedTeam.js";
import ComplaintHistoryModel from "../model/complaint-history.model.js";
import { log } from "console";
let createComplaint = async (req, res, next) => {
    try {
         
      let {city,category, description, addressDescription } = req.body;
      
       location = JSON.parse(location);
      // console.log("Received location:", location);
      // ----------------------
      // for postman testing
      // let [lng, lat] = location; 
      // ----------------------

      // let tempLocatin={
      // lng:74.2914370,
      // lat:31.5449325     }
      //  let {lng, lat} = tempLocatin;
       let {lng, lat} = location;

      lng = parseFloat(lng);
      lat = parseFloat(lat);
      log("Parsed location:", { lat, lng });
      
      // res.end("--")
      // return;

     const complainant = await complainantModel.findOne({
      userID: req.user._id,
    });
   

    if (!complainant) {
      return res.status(403).json({
        message: "Only complainants can create complaints",
      });
    }
    // Verify city
    let cityRecord = await CityModel.findOne({name:city, isActive:true});
    if(!cityRecord){
        let error = new Error("City is not serviceable");
        error.status = 404;
       return next(error);
      }

      // let [lng, lat] = location;
      // lng = parseFloat(lng).toFixed(6);
      // lat = parseFloat(lat).toFixed(6);
      // console.log("Parsed location:", { lat, lng });
    
    
    let DUPLICATE_RADIUS_METERS = parseInt(process.env.DUPLICATE_RADIUS_METERS) || 200;

    // 2️⃣ Auto‑detect zone using GeoJSON polygon
    const theZone = await Zone.findOne({
      city: cityRecord._id,
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      },
    });

  
   let outOfServiceZone = false;
    if (!theZone) {//-----------TODO
      
      // assign to zone close to location. Not far than 5 km
      const nearbyZone = await Zone.findOne({
        city: cityRecord._id,
        geometry: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: 5000, // 5 km
          },
        },
      });
      if (nearbyZone) {
        theZone = nearbyZone;
        outOfServiceZone = true;
        
      }else{
        // Out of service zone
        let error = new Error("Location is out of service zone");
        error.status = 400;
       return next(error);
       }

    }

    // 3️⃣ Check for duplicate complaint
    const duplicateComplaint = await ComplaintModel.findOne({
      category,
      city: cityRecord._id,
      CurrentStatus: { $in: ["Pending", "Assigned", "In-Progress"] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: DUPLICATE_RADIUS_METERS,
        },
      },
      
    });
    if (duplicateComplaint) {
      
      // Add complainant to votesBy array if not already present
      if (!duplicateComplaint.votesBy.includes(complainant._id)) {
        duplicateComplaint.votesBy.push(complainant._id);
        duplicateComplaint.votes += 1;
        await duplicateComplaint.save();
         return res.status(200).json({
        success: true,
        message: "Duplicate complaint detected. Your vote has been counted.",
        complaint: duplicateComplaint,
        status: 200
      });
      }
      return res.status(409).json({
        success: true,
        message: "Duplicate complaint detected. You have already voted for this complaint.",
        complaint: duplicateComplaint,
        status: 409
      });
    
    }
    
    //     let mediaByUser = null;
    //     if (!req.file) {
    //   return res.status(400).json({
    //     ErrorMeassage: "No file to upload",
    //   });
    // }
    // let tempFile = path.resolve("uploads", req.file.originalname);
    // fs.writeFileSync(tempFile, req.file.buffer);

    // let uploadResult = await cloudinary.uploader.upload(tempFile, {
    //   resource_type: "auto",
    //   folder: "ComplaintMedia",
    // });
    // mediaByUser = {
    //   publicId: uploadResult.public_id,
    //   url: uploadResult.secure_url,
    // };
    // fs.unlinkSync(tempFile);

    
  let mediaByUser = [];

  if (!req.files || req.files.length === 0) {
  return res.status(400).json({
    ErrorMessage: "No files uploaded",
  });
}

for (let file of req.files) {
  let tempFile = path.resolve("uploads", file.originalname);

  fs.writeFileSync(tempFile, file.buffer);

  let uploadResult = await cloudinary.uploader.upload(tempFile, {
    resource_type: "auto",
    folder: "ComplaintMedia",
  });

  mediaByUser.push({
    publicId: uploadResult.public_id,
    url: uploadResult.secure_url,
  });

  fs.unlinkSync(tempFile);
}


        // 4️⃣ Create complaint
        const complaint = new ComplaintModel({
            complainant: complainant._id,
            category,
            city: cityRecord._id,
            zone: theZone._id,
            description,
            location: {
                type: "Point",
                 coordinates: [lng, lat], },
            media: [
               ...mediaByUser
            ],
            votesBy: [complainant._id],
            votes: 1,
            outOfServiceZone: outOfServiceZone,
            addressDescription: addressDescription
        });
        await complaint.save();
        outOfServiceZone = false;
        // 5️⃣ Log complaint creation in history
        const complaintHistory = new ComplaintHistoryModel({
          complaint: complaint._id,
          actionType: "CREATED",
          newStatus: complaint.CurrentStatus,
          actedBy: req.user._id,
          remarks: "Complaint created by complainant",
        });
        await complaintHistory.save();

        // Auto-assign team
        const assignedTeam = await autoAssignTeam(complaint);
        if (assignedTeam) {
          complaint.assignedTeam = assignedTeam._id;
          complaint.CurrentStatus = "Assigned";
          await complaint.save();
        }
       // log complaint history creation 

        await ComplaintHistoryModel.create({
        complaint: complaint._id,
        actionType: "ASSIGNED",
        oldStatus: "Pending",
        newStatus: "Assigned",
        team: assignedTeam._id,
        actedBy: null, // system auto assignment
        remarks: "Auto-assigned to zone team"
                                            });
      
        res.status(201).json({ success: true, message: "Complaint created successfully", complaint: complaint,status:201 });
        
    } catch (error) {
        next(error);
    }
}

export { createComplaint };