import { useEffect, useState } from "react";
import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL;
let teamLeadRoute = import.meta.env.VITE_API_TEAMLEAD_ROUTE;
export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 API CALL PLACE (You will replace URL)
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${apiUrl}${teamLeadRoute}/get-teams`, {
          withCredentials: true,
        });
        setTeams(res.data.teams);
      } catch (err) {
        console.log("Error fetching teams: ", err.response?.data || err.message);
        setError("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }
  if (teams.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold">No teams found.</p>
      </div>
    );
  }

  return (
    <>
       <h1 className="font-bold text-2xl text-center mb-4">Team Lead By You</h1>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
        >
          {/* Team Header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {team.teamName}
            </h2>
            <p className="text-sm text-gray-500">
              Lead: {team.teamLeadName}
            </p>
          </div>

          {/* Location Info */}
          <div className="mb-4 text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold">City:</span> {team.cityName}</p>
            <p><span className="font-semibold">Zone:</span> {team.zoneName}</p>
          </div>

          {/* Members */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Members</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {team.members.map((member, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                >
                  <span className="text-sm font-medium">
                    {member.name}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {member.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}


// =========================
// Expected Backend Response
// =========================

/*
{
  teams: [
    {
      teamName: "Team Alpha",
      teamLeadName: "Ali",
      cityName: "Lahore",
      zoneName: "Zone 1",
      members: [
        { name: "Ahmed", skill: "Electrician" },
        { name: "Usman", skill: "Plumber" }
      ]
    }
  ]
}
*/


// =========================
// Where to Use
// =========================

/*
<Route path="team/teams" element={<Teams />} />
*/
