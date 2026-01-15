
import teamModel from "../model/team.model.js";
import employeeModel from "../model/employee.model.js";
import zoneModel from "../model/zone.model.js";
import cityModel from "../model/city.model.js";


let createTeam = async (req, res, next) => {

    try {
        let { name, leaderId, cityId, zone, members } = req.body;
            
        //check Leadr is a teamLead or not
        let leaderRecord = await employeeModel.findOne({_id: leaderId, role: "teamLead"});
        if(!leaderRecord){
            let error = new Error("Employee is not a team lead");
            error.status = 400;
            return next(error);
        }

        //checking unique team lead and members
        let teamLeadRecord = await teamModel.findOne({leader: leaderId});
        console.log("teamR: ",teamLeadRecord);
        
        if(teamLeadRecord){
            let error = new Error("Team lead is already assigned to another team with id: "+ teamLeadRecord._id);
            error.status = 400;
            return next(error);
        }
        let teamMemberRecord = await teamModel.findOne({members: {$in: members}});
        if(teamMemberRecord){
            let error = new Error("One or more team members are already assigned to another team with id: "+ teamMemberRecord._id);
            error.status = 400;
            return next(error);
        }
        
        let getZoneRecord = await zoneModel.findOne({name: zone});
        let teamRecord = new teamModel({
            name,
            leader: leaderId,
            city: cityId,
            zone: getZoneRecord._id,
            members});
        await teamRecord.save();
        res.status(201).json({
            success: true,
            message: "Team created successfully",
            data: teamRecord
        });

    } catch (error) {
        next(error);
    }

}

let getTeams= async (req, res, next) => {
    try {
        
        let teams = await teamModel.find()
        .populate("leader", "fullName contactNumber")
        .populate("city", "name")
        .populate("zone", "name")
        .populate("members", "fullName contactNumber");
        res.status(200).json({
            success: true,
            data: teams
        });

    } catch (error) {
        next(error);    
    }
}

export { createTeam, getTeams };