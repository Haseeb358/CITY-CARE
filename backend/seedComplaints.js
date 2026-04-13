import mongoose from "mongoose";
import dotenv from "dotenv";
import ComplaintModel from "./model/complaint.model.js";
import ComplaintHistoryModel from "./model/complaint-history.model.js";
import CityModel from "./model/city.model.js";
import ZoneModel from "./model/zone.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Database connected for seeding");

    const categories = ["Water Supply", "Garbage Collection", "Manhole Issue", "Pothole", "Street Light"];
    const lahoreZones = ["Gulberg", "Badami Bagh", "Shah Kamal", "Shah Jamal", "Johar Town"];

    // 1. Ensure Lahore city exists
    let lahoreCity = await CityModel.findOne({ name: "Lahore" });
    if (!lahoreCity) {
      lahoreCity = await CityModel.create({ name: "Lahore", province: "Punjab", isActive: true });
      console.log("Created Lahore City");
    }

    // 2. Ensure Zones exist
    const zoneIds = [];
    for (const zoneName of lahoreZones) {
      let zone = await ZoneModel.findOne({ name: zoneName, city: lahoreCity._id });
      if (!zone) {
        zone = await ZoneModel.create({
          name: zoneName,
          city: lahoreCity._id,
          geometry: {
            type: "Polygon",
            coordinates: [[
              [74.3, 31.5], [74.4, 31.5], [74.4, 31.6], [74.3, 31.6], [74.3, 31.5]
            ]]
          },
          isActive: true
        });
        console.log(`Created Zone: ${zoneName}`);
      }
      zoneIds.push({ id: zone._id, name: zoneName });
    }

    const complaints = [];
    const histories = [];

    // Seed 5 complaints for Lahore
    for (let i = 0; i < 5; i++) {
      const complainantId = new mongoose.Types.ObjectId();
      const category = categories[i % categories.length];
      const zoneInfo = zoneIds[i % zoneIds.length];

      const complaintId = new mongoose.Types.ObjectId();

      const complaint = {
        _id: complaintId,
        complainant: complainantId,
        category: category,
        city: lahoreCity._id,
        zone: zoneInfo.id,
        description: `This is a sample complaint regarding ${category} in Lahore, zone ${zoneInfo.name}.`,
        location: {
          type: "Point",
          coordinates: [74.3587 + (Math.random() * 0.1), 31.5204 + (Math.random() * 0.1)] 
        },
        CurrentStatus: "Pending",
        media: [],
        votes: Math.floor(Math.random() * 50),
        votesBy: [],
        addressDescription: `Sample Street ${i + 1}, Lahore`,
        outOfServiceZone: false
      };

      complaints.push(complaint);

      const history = {
        complaint: complaintId,
        actionType: "CREATED",
        oldStatus: null,
        newStatus: "Pending",
        actedBy: complainantId,
        remarks: "Complaint submitted successfully."
      };

      histories.push(history);
    }

    await ComplaintModel.insertMany(complaints);
    await ComplaintHistoryModel.insertMany(histories);

    console.log("Successfully seeded 5 complaints and their histories for Lahore.");
    console.log("Complaints IDs generated:");
    complaints.forEach((c) => console.log(`- ${c._id.toString()} (${c.category} in ${lahoreZones[complaints.indexOf(c) % lahoreZones.length]})`));
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
