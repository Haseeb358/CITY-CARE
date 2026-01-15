import Complaint  from "../model/complaint.model.js";
import Team from "../model/team.model.js";

export const autoAssignTeam = async (complaint) => {
  // 1️⃣ Get all active teams in the same zone
  const teams = await Team.find({
    zone: complaint.zone,
    isActive: true,
  });

  if (!teams.length) return null;

  // 2️⃣ Count active complaints per team
  const teamLoad = await Promise.all(
    teams.map(async (team) => {
      const count = await Complaint.countDocuments({
        assignedTeam: team._id,
        CurrentStatus: { $in: ["Assigned", "In-Progress"] },
      });
      return { team, count };
    })
  );

  // 3️⃣ Pick least loaded team
  teamLoad.sort((a, b) => a.count - b.count);

  return teamLoad[0].team;
};