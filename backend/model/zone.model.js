import mongoose from "mongoose";
import fs from "fs";

const zoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true
    },

    geometry: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true
      },
      coordinates: {
        type: [[[Number]]], // GeoJSON Polygon
        required: true
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
zoneSchema.index({ geometry: "2dsphere" });

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;

