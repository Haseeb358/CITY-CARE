import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let ROUTE = import.meta.env.VITE_API_CITY_MANAGER_ROUTE;

const UpdateTeamModal = ({ team, onClose, onUpdated, city }) => {
  const [zones, setZones] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [selectedZone, setSelectedZone] = useState(team.zone?._id);
  const [selectedLeader, setSelectedLeader] = useState(team.leader?._id);
  const [selectedMembers, setSelectedMembers] = useState(
    team.members?.map(m => m._id) || []
  );

  const [loading, setLoading] = useState(false);

  // ✅ Fetch zones
  const fetchZones = async () => {
    const { data } = await axios.get(`${API_URL}${ROUTE}/teamzones`, {
      params: { city },
      withCredentials: true
    });
    setZones(data.zones);
  };

  // ✅ Fetch eligible employees (with current team included)
  const fetchEligible = async () => {
    const { data } = await axios.get(
      `${API_URL}${ROUTE}/employees/eligible`,
      {
        params: {
          city,
          teamId: team._id   // 🔥 important
        },
        withCredentials: true
      }
    );

    setTeamLeads(data.teamLeads);
    setWorkers(data.workers);
  };

  useEffect(() => {
    fetchZones();
    fetchEligible();
  }, []);

  // ✅ toggle members
  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  // ✅ submit
  const handleUpdate = async () => {
    if (!selectedLeader) {
      return toast.error("Team lead required");
    }

    if (selectedMembers.length === 0) {
      return toast.error("At least 1 worker required");
    }

    try {
      setLoading(true);

      await axios.put(
        `${API_URL}${ROUTE}/teams/${team._id}`,
        {
          leader: selectedLeader,
          members: selectedMembers,
          zone: selectedZone
        },
        { withCredentials: true }
      );

      toast.success("Team updated");
      onUpdated();
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-5 rounded w-162.5 max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">Update Team</h2>

        {/* Zone */}
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          {zones.map(z => (
            <option key={z._id} value={z._id}>
              {z.name}
            </option>
          ))}
        </select>

        {/* Leader */}
        <select
          value={selectedLeader}
          onChange={(e) => setSelectedLeader(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Team Lead</option>
          {teamLeads.map(t => (
            <option key={t._id} value={t._id}>
              {t.fullName}
            </option>
          ))}
        </select>

        {/* Members */}
        <div>
          <label className="text-sm font-medium">Workers</label>

          <div className="border p-2 rounded max-h-40 overflow-y-auto">
            {workers.map(w => (
              <label key={w._id} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(w._id)}
                  onChange={() => toggleMember(w._id)}
                />
                {w.fullName}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateTeamModal;