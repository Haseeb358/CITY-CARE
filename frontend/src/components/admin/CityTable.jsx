import axios from "axios";
import { toast } from "react-hot-toast";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const CityTable = ({ cities, refresh }) => {

  const toggleStatus = async (id) => {
    try {
      await axios.put(
        `${API_URL}${API_ADMIN_ROUTE}/cities/toggle/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("Status updated");
      refresh();

    } catch {
      toast.error("Failed");
    }
  };

  if(cities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow mt-4 p-5 text-center"> 
        No cities found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow mt-4 overflow-hidden">

      <table className="w-full table-fixed">

        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-3 w-[40%] text-left">City</th>
            <th className="px-4 py-3 w-[30%] text-left">Province</th>
            <th className="px-4 py-3 w-[30%] text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {cities.map(c => (
            <tr key={c._id} className="border-t hover:bg-gray-50">

              <td className="px-4 py-3">{c.name}</td>
              <td className="px-4 py-3">{c.province}</td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => toggleStatus(c._id)}
                  className={`px-3 py-1 rounded text-xs ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default CityTable;