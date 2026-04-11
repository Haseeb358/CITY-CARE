import City from "../model/city.model.js";
import Zone from "../model/zone.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import userModel from "../model/user.model.js";
import employeeModel from "../model/employee.model.js";
import ComplaintModel from "../model/complaint.model.js";
import ComplaintHistoryModel from "../model/complaint-history.model.js";
import teamModel from "../model/team.model.js";
import donationModel from "../model/donation.model.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";


let createCity = async (req, res, next) => {
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
        let cat = req.body.category;
        let existingCategory = await ComplaintCategoryModel.findOne({ name: cat });
        if (existingCategory) {
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

let getAllUsers = async (req, res, next) => {
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

let createEmployeeRecord = async (req, res, next) => {

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
        let cityRecord = await City.findOne({ name: city });
        if (!cityRecord) {
            let error = new Error("City not found");
            error.status = 400;
            return next(error);
        }
        let newEmployee = new employeeModel({
            fullName, city: cityRecord._id, role, zone, skills, address, contactNumber, CNIC, joinedDate, DOB, education,

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

let updateEmployeeRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.city) {
            let cityRecord = await City.findOne({ name: updateData.city });
            if (!cityRecord) {
                let error = new Error("City not found");
                error.status = 400;
                return next(error);
            }
            updateData.city = cityRecord._id;
        }

        if (updateData.zone) {
            let zoneRecord = await Zone.findOne({ name: updateData.zone });
            if (!zoneRecord) {
                let error = new Error("Zone not found");
                error.status = 400;
                return next(error);
            }
            updateData.zone = zoneRecord._id;
        }


        let updatedEmployee = await employeeModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            let error = new Error("Employee not found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Employee record updated successfully",
            data: updatedEmployee,
        });

    } catch (error) {
        next(error);
    }
};

let deleteEmployeeRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        let deletedEmployee = await employeeModel.findByIdAndDelete(id);


        if (!deletedEmployee) {
            let error = new Error("Employee not found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Employee record deleted successfully",
            data: deletedEmployee,
        });

    } catch (error) {
        next(error);
    }
};

let getAnalyticsData = async (query) => {
    const { timeFilter, city, category } = query;

    // 1. Build Base Match Stage
    let matchStage = {};

    let cityObjectId = null;
    if (city && city !== "all") {
        let cityDoc = await City.findOne({ name: city });
        cityObjectId = cityDoc ? cityDoc._id : new mongoose.Types.ObjectId();

        matchStage.city = cityObjectId;
    }

    if (category && category !== "all") {
        matchStage.category = category;
    }

    let dateLimit = null;
    const now = new Date();
    if (timeFilter === "last7days") {
        dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 7);
    } else if (timeFilter === "last30days") {
        dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 30);
    } else if (timeFilter === "last3months") {
        dateLimit = new Date();
        dateLimit.setMonth(dateLimit.getMonth() - 3);
    }

    if (dateLimit) {
        matchStage.createdAt = { $gte: dateLimit };
    }

    // 2. Fetch Overview KPIs
    const totalComplaints = await ComplaintModel.countDocuments(matchStage);

    const resolvedComplaints = await ComplaintModel.countDocuments({ ...matchStage, CurrentStatus: "Resolved" });
    const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : 0;

    const pendingComplaints = await ComplaintModel.countDocuments({
        ...matchStage,
        CurrentStatus: "Pending",
    });

    const activeTeamsFilter = { isActive: true };
    if (city && city !== "all" && cityObjectId) {
        activeTeamsFilter.city = cityObjectId;
    }
    const activeTeams = await teamModel.countDocuments(activeTeamsFilter);

    // Calculate Average Resolution Time
    const resolvedHistory = await ComplaintModel.aggregate([
        { $match: { ...matchStage, CurrentStatus: "Resolved" } },
        {
            $project: {
                timeToResolve: { $subtract: ["$updatedAt", "$createdAt"] }
            }
        },
        { $group: { _id: null, avgTimeMs: { $avg: "$timeToResolve" } } }
    ]);
    // convert ms to hours
    const avgResolutionTimeHours = resolvedHistory.length > 0
        ? (resolvedHistory[0].avgTimeMs / (1000 * 60 * 60)).toFixed(2)
        : 0;

    // 3. Complaint Analytics
    // over time (group by day)
    const complaintsOverTime = await ComplaintModel.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // by status
    const complaintsByStatus = await ComplaintModel.aggregate([
        { $match: matchStage },
        { $group: { _id: "$CurrentStatus", count: { $sum: 1 } } }
    ]);

    // by category
    const complaintsByCategory = await ComplaintModel.aggregate([
        { $match: matchStage },
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // by city
    const complaintsByCity = await ComplaintModel.aggregate([
        { $match: matchStage },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $lookup: { from: "cities", localField: "_id", foreignField: "_id", as: "cityInfo" } },
        { $unwind: { path: "$cityInfo", preserveNullAndEmptyArrays: true } },
        { $project: { city: "$cityInfo.name", count: 1 } }
    ]);

    // 4. Team & Employee Performance
    const complaintsResolvedPerTeam = await ComplaintHistoryModel.aggregate([
        { $match: { actionType: "RESOLVED", team: { $ne: null } } },
        { $group: { _id: "$team", resolvedCount: { $sum: 1 } } },
        { $lookup: { from: "teams", localField: "_id", foreignField: "_id", as: "teamInfo" } },
        { $unwind: { path: "$teamInfo", preserveNullAndEmptyArrays: true } },
        { $project: { teamName: "$teamInfo.name", resolvedCount: 1, leader: "$teamInfo.leader" } },
        { $sort: { resolvedCount: -1 } },
        { $limit: 10 }
    ]);

    // 5. Donations
    const totalDonationsAgg = await donationModel.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonationsAllTime = totalDonationsAgg.length > 0 ? totalDonationsAgg[0].total : 0;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthDonationAgg = await donationModel.aggregate([
        { $match: { donatedAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonationsThisMonthSum = thisMonthDonationAgg.length > 0 ? thisMonthDonationAgg[0].total : 0;

    return {
        overview: {
            totalComplaints,
            resolutionRate,
            averageResolutionTimeHours: parseFloat(avgResolutionTimeHours),
            pendingComplaints,
            activeTeams
        },
        complaintAnalytics: {
            overTime: complaintsOverTime,
            byStatus: complaintsByStatus,
            byCategory: complaintsByCategory,
            byCity: complaintsByCity,
        },
        teamPerformance: {
            leaderboard: complaintsResolvedPerTeam
        },
        donations: {
            totalAllTime: totalDonationsAllTime,
            totalThisMonth: totalDonationsThisMonthSum
        }
    };
};

let getAdminAnalytics = async (req, res, next) => {
    try {
        let data = await getAnalyticsData(req.query);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

let generateReport = async (req, res, next) => {
    try {
        const data = await getAnalyticsData(req.query);

        const doc = new PDFDocument({ margin: 50 });
        let filename = `Analytics_Report_${new Date().toISOString().split('T')[0]}`;

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '.pdf"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header Title
        doc.fontSize(22).text('CityCare Admin Analytics Report', { align: 'center' });
        doc.moveDown(1.5);

        // Overview KPIs
        doc.fontSize(16).text('Overview KPIs', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Complaints: ${data.overview.totalComplaints}`);
        doc.text(`Resolution Rate: ${data.overview.resolutionRate}%`);
        doc.text(`Average Resolution Time: ${data.overview.averageResolutionTimeHours} hours`);
        doc.text(`Pending Complaints: ${data.overview.pendingComplaints}`);
        doc.text(`Active Teams: ${data.overview.activeTeams}`);
        doc.moveDown(1.5);

        // Donations
        doc.fontSize(16).text('Donations', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Donations (All Time): PKR ${data.donations.totalAllTime}`);
        doc.text(`Total Donations (This Month): PKR ${data.donations.totalThisMonth}`);
        doc.moveDown(1.5);

        // Complaints by Status
        doc.fontSize(16).text('Complaints by Status', { underline: true });
        doc.moveDown(0.5);
        data.complaintAnalytics.byStatus.forEach(status => {
            doc.fontSize(12).text(`- ${status._id}: ${status.count}`);
        });
        doc.moveDown(1.5);

        // Team Performance
        if (data.teamPerformance.leaderboard && data.teamPerformance.leaderboard.length > 0) {
            doc.fontSize(16).text('Top Performing Teams', { underline: true });
            doc.moveDown(0.5);
            data.teamPerformance.leaderboard.forEach((t, i) => {
                doc.fontSize(12).text(`${i + 1}. ${t.teamName} - Resolved: ${t.resolvedCount}`);
            });
            doc.moveDown(1.5);
        }

        doc.end();

    } catch (error) {
        next(error);
    }
};

export { createCity, complaintCategories, getAllUsers, createEmployeeRecord, updateEmployeeRecord, deleteEmployeeRecord, getAdminAnalytics, generateReport };
