import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;
// toast
import { toast } from "react-hot-toast";
const ZoneStatusToggle = ({ zone, refresh }) => {

  const handleToggle = async () => {
    try {
      await axios.put(
        `${API_URL}${API_ADMIN_ROUTE}/zones/${zone._id}/toggle`,
        {},
        { withCredentials: true }
      );
        toast.success(`Zone is now ${zone.isActive ? "Inactive" : "Active"}`);
      refresh();

    } catch (err) {
      console.error(err);
        toast.error(err.response?.data?.message || "Failed to toggle zone status");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="text-blue-600 hover:underline text-sm"
    >
      Toggle Status
    </button>
  );
};

export default ZoneStatusToggle;