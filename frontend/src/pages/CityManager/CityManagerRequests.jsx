import { useEffect, useState } from "react";
import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL;
let cityManagerRoute = import.meta.env.VITE_API_CITY_MANAGER_ROUTE;
import {toast} from "react-hot-toast"
const CityManagerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: ""
  });

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}${cityManagerRoute}/requests`, {
        params: { ...filters, page },
        withCredentials: true
      });

      setRequests(res.data.requests);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters, page]);

  const handleUpdate = async (statusType) => {
    try {
      await axios.put(`${apiUrl}${cityManagerRoute}/requests/${selected._id}/update-status`, {
        status: statusType,
        remarks,
        
      },{
        withCredentials: true
      });

      setSelected(null);
      setRemarks("");
      fetchRequests();
      toast.success(`Request ${statusType.toLowerCase()} successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">

      {/* 🔍 FILTER BAR */}
      <div className="bg-[#1e293b] p-4 rounded-xl flex flex-wrap gap-4 items-end">

        <div>
          <label className="text-sm">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="bg-[#0f172a] p-2 rounded w-full"
          >
            <option value="">All</option>
            <option>Sent</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="bg-[#1e293b] p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="bg-[#1e293b] p-2 rounded"
          />
        </div>

        <button
          onClick={() => setFilters({ status: "", startDate: "", endDate: "" })}
          className="bg-gray-600 px-3 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* 📋 REQUEST LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="bg-[#1e293b] p-4 rounded-xl">
            <div className="flex justify-between">
              <h2>{r.title}</h2>
              <StatusBadge status={r.status == "Sent" ? "Pending_Sent" : r.status} />
            </div>

            <p className="text-gray-400">{r.message}</p>

            <p className="text-sm mt-2">
              From: {r.fromTeamLead?.fullName}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>

            {r.status === "Sent" && (
              <button
                className="mt-3 bg-blue-600 px-3 py-1 rounded"
                onClick={() => setSelected(r)}
              >
                Take Action
              </button>
            )}

            {r.remarks && (
              <p className="text-green-400 mt-2">
                Remarks: {r.remarks}
              </p>
            )}
          </div>
        ))
      )}

      {/* 🔢 PAGINATION */}
      <div className="flex gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          Prev
        </button>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>

      {/* 🧾 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1e293b] p-6 rounded-xl w-96">
            <h2 className="mb-3">Add Remarks</h2>

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 bg-[#0f172a] rounded"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleUpdate("Accepted")}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => handleUpdate("Rejected")}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => setSelected(null)}
                className="bg-gray-600 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Pending_Sent: "bg-yellow-500",
    Accepted: "bg-green-500",
    Rejected: "bg-red-500"
  };

  return (
    <span className={`${colors[status]} px-2 py-1 rounded text-sm`}>
      {status}
    </span>
  );
};

export default CityManagerRequests;