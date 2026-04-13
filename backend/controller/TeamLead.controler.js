import teamModel from "../model/team.model.js";
import employeeModel from "../model/employee.model.js";
import complaintModel from "../model/complaint.model.js";
import zoneModel from "../model/zone.model.js";
import complaintHistoryModel from "../model/complaint-history.model.js";
import { uploadMedia } from "../utils/mediaUpload.js";  
let getTeamsForTeamLead = async (req, res,next) => {
   try {
  
    let teamLeadId = req.user?.employeeId;
    let teams = await teamModel.find({ leader: teamLeadId })
    .populate("leader", "fullName")
    .populate("zone", "name")
    .populate("city", "name")
    .populate("members", "fullName skills");

    if(teams.length === 0){
        return res.status(404).json({ success: false, message: "No teams found for this team lead." });
    }

    let formattedTeams = teams.map(team => ({
        _id: team._id,
        teamName: team.name,
        teamLeadName: team.leader.fullName,
        cityName: team.city.name,
        zoneName: team.zone ? team.zone.name : "N/A",
        members: team.members.map(member => ({
            name: member.fullName,
            skill: member.skills
        }))
    }));
    res.status(200).json({ success: true, teams: formattedTeams });
   } catch (error) {
    next(error);
   }

}

// new we get the teams for the team lead and then we will get the complaints for those teams in the next step.

// let getComplaintsForTeamLead = async (req, res,next) => {
//     try {
        
//         let teamLeadId = req.user?.employeeId;
//         let teams = await teamModel.find({ leader: teamLeadId }).select("_id");
//         let teamIds = teams.map(team => team._id);

//         let complaints = await complaintModel.find({ assignedTeam: { $in: teamIds } })
//         .populate("assignedTeam", "name")
//         .populate("city", "name")
//         .populate("zone", "name");

//         res.status(200).json({

//             success: true,
//             complaints: complaints
//         });
           
        

//     } catch (error) {
//         next(error);
//     }
// }

// let getComplaintsForTeamLead = async (req, res, next) => {
//   try {
//     let teamLeadId = req.user?.employeeId;

//     let { 
//       status, 
//       team, 
//       dateFilter, 
//       page = 1, 
//       limit = 10 
//     } = req.query;

//     let teams = await teamModel.find({ leader: teamLeadId }).select("_id name");

//     let teamIds = teams.map(t => t._id);

//     let query = {
//       assignedTeam: { $in: teamIds }
//     };

//     // ✅ STATUS FILTER
//     if (status) {
//       query.CurrentStatus = status;
//     }

//     // ✅ TEAM FILTER
//     if (team) {
//       query.assignedTeam = team;
//     }

//     // ✅ DATE FILTER
//     if (dateFilter) {
//       let now = new Date();
//       let startDate;

//       if (dateFilter === "today") {
//         startDate = new Date(now.setHours(0, 0, 0, 0));
//       } 
//       else if (dateFilter === "yesterday") {
//         startDate = new Date(now.setDate(now.getDate() - 1));
//         startDate.setHours(0, 0, 0, 0);
//       } 
//       else if (dateFilter === "week") {
//         startDate = new Date(now.setDate(now.getDate() - 7));
//       } 
//       else if (dateFilter === "month") {
//         startDate = new Date(now.setMonth(now.getMonth() - 1));
//       }

//       if (startDate) {
//         query.createdAt = { $gte: startDate };
//       }
//     }

//     // ✅ PAGINATION
//     let skip = (page - 1) * limit;

//     let complaints = await complaintModel
//       .find(query)
//       .populate("assignedTeam", "name")
//       .populate("zone", "name")
//       .populate("city", "name")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     let total = await complaintModel.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       complaints,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (error) {
//     next(error);
//   }
// };
let getComplaintsForTeamLead = async (req, res, next) => {
  try {
    let teamLeadId = req.user?.employeeId;

    let { 
      status, 
      team, 
      dateFilter, 
      zoneSearch,   // 🔥 NEW
      page = 1, 
      limit = 10 
    } = req.query;

    // ✅ Get teams under team lead
    let teams = await teamModel.find({ leader: teamLeadId }).select("_id city");

    let teamIds = teams.map(t => t._id);

    let query = {
      assignedTeam: { $in: teamIds }
    };

    // ✅ STATUS FILTER
    if (status) {
      query.CurrentStatus = status;
    }

    // ✅ TEAM FILTER
    if (team) {
      query.assignedTeam = team;
    }

    // ✅ DATE FILTER
    if (dateFilter) {
      let now = new Date();
      let startDate;

      if (dateFilter === "today") {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } 
      else if (dateFilter === "yesterday") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
      } 
      else if (dateFilter === "week") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } 
      else if (dateFilter === "month") {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    // ✅ 🔥 ZONE SEARCH FILTER
    // if (zoneSearch) {
    //   // find zones matching search
    //   let zones = await zoneModel.find({
    //     name: { $regex: zoneSearch, $options: "i" }
    //   }).select("_id");

    //   let zoneIds = zones.map(z => z._id);

    //   query.zone = { $in: zoneIds };
    // }
    console.log("Zone search term: ", zoneSearch);
    if (zoneSearch ) {
  let zones = await zoneModel.find({
    name: { $regex: `^${zoneSearch}`, $options: "i" }
  }).select("_id");

  let zoneIds = zones.map(z => z._id);

  if (zoneIds.length === 0) {
    return res.status(200).json({
      success: true,
      complaints: [],
      total: 0,
      page: 1,
      totalPages: 0
    });
  }

  query.zone = { $in: zoneIds };
}

    // ✅ PAGINATION
    let skip = (page - 1) * limit;

    let complaints = await complaintModel
      .find(query)
      .populate("assignedTeam", "name")
      .populate("zone", "name")
      .populate("city", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    let total = await complaintModel.countDocuments(query);

    res.status(200).json({
      success: true,
      complaints,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    next(error);
  }
};

let getComplaintWithHistory = async (req, res, next) => {
  try {
    let { id } = req.params;
   console.log("Fetching details for complaint ID: ", id);
    let complaint = await complaintModel
      .findById(id)
      .populate("zone", "name")
      .populate("city", "name")
      .populate("assignedTeam", "name");

    let history = await complaintHistoryModel
      .find({ complaint: id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaint,
      history
    });

  } catch (err) {
    next(err);
  }
};
let updateComplaintStatus = async (req, res, next) => {
  let resolvedMediaUrls = [];
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const files = req.files; // Access uploaded files
    
    if (status === "Resolved") {
      resolvedMediaUrls = await uploadMedia(files);
    }
  
    let complaint = await complaintModel.findById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    console.log(complaint)
    let oldStatus = complaint.CurrentStatus;
    console.log("old status: ", oldStatus, " new status: ", status);
    // res.end("ok");
    // return; // Remove this after testing
    // addinf a new filed in complaint of resolvedMedia and its value is resolvedMedia
    if (status === "Resolved") {
      complaint.resolvedMedia = resolvedMediaUrls;
      }
    complaint.CurrentStatus = status;

    await complaint.save();

    // complaint history entry
    await complaintHistoryModel.create({
      complaint: id,
      actionType: "STATUS_CHANGED",
      oldStatus,
      newStatus: status,
      remarks,
      actedBy: req.user?.employeeId,
      team: complaint.assignedTeam
    });

    res.status(200).json({
      success: true,
      message: "Status updated"
    });


  } catch (error) {
    next(error);
  }

};

export { getTeamsForTeamLead, getComplaintsForTeamLead, getComplaintWithHistory,updateComplaintStatus };    