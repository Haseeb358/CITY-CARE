import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let ROUTE = import.meta.env.VITE_API_CITY_MANAGER_ROUTE;

const CreateTeamModal = ({ onClose, city, onCreated }) => {
  const { register, handleSubmit, watch } = useForm();

  const [zones, setZones] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedZone = watch("zone");

  // ✅ Fetch Zones
  const fetchZones = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}${ROUTE}/teamzones`,
        {
          params: { city },
          withCredentials: true
        }
      );
      setZones(data.zones);
    } catch (err) {
      toast.error("Failed to fetch zones");
    }
  };

  // ✅ Fetch Eligible Employees
  const fetchEligibleEmployees = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}${ROUTE}/employees/eligible`,
        {
          params: { city },
          withCredentials: true
        }
      );

      setTeamLeads(data.teamLeads);
      setWorkers(data.workers);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchZones();
    fetchEligibleEmployees();
  }, []);

  // ✅ Handle multi select
  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  // ✅ Submit
  const onSubmit = async (formData) => {
    if (!formData.zone || !formData.leader) {
      return toast.error("Zone and Team Lead required");
    }

    if (selectedMembers.length === 0) {
      return toast.error("Select at least 1 member");
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}${ROUTE}/createTeam`,
        {
          name: formData.name,
          zone: formData.zone,
          leader: formData.leader,
          members: selectedMembers,
          city: city
        },
        { withCredentials: true }
      );

      toast.success("Team created successfully");
      onCreated();
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-5 rounded w-150 max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">Create Team</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Team Name */}
          <input
            {...register("name", { required: true })}
            placeholder="Team Name"
            className="w-full border p-2 rounded"
          />

          {/* Zone */}
          <select {...register("zone")} className="w-full border p-2 rounded">
            <option value="">Select Zone</option>
            {zones.map(z => (
              <option key={z._id} value={z._id}>
                {z.name}
              </option>
            ))}
          </select>

          {/* Team Lead */}
          <select {...register("leader")} className="w-full border p-2 rounded">
            <option value="">Select Team Lead</option>
            {teamLeads.map(t => (
              <option key={t._id} value={t._id}>
                {t.fullName}
              </option>
            ))}
          </select>

          {/* Members Multi Select */}
          <div>
            <label className="text-sm font-medium">Select Members</label>

            <div className="border p-2 rounded max-h-40 overflow-y-auto">
              {workers.map(w => (
                <label key={w._id} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    onChange={() => toggleMember(w._id)}
                  />
                  {w.fullName}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} type="button" className="px-3 py-1 bg-gray-300 rounded">
              Cancel
            </button>

            <button disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;