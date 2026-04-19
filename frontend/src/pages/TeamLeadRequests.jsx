import { useEffect, useState } from "react";
import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL;
let teamLeadRoute = import.meta.env.VITE_API_TEAMLEAD_ROUTE;
import {toast} from "react-hot-toast"
const TeamLeadRequests = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [filters, setFilters] = useState({ status: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}${teamLeadRoute}/requests`, {
        params: { ...filters, page },
        withCredentials: true
      });

      setRequests(res.data.requests);

    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}${teamLeadRoute}/requests`, form, {
        withCredentials: true
      });
      setForm({ title: "", message: "" });
      fetchRequests();
        toast.success("Request sent successfully!");
    } catch (err) {
        console.error(err.response?.data || err);
        toast.error("Failed to send request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white space-y-6">

      {/* CREATE FORM */}
      <form onSubmit={handleSubmit} className="bg-[#1e293b] p-4 rounded-xl space-y-3">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 bg-[#0f172a] rounded"
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full p-2 bg-[#0f172a] rounded"
        />

        <button className="bg-blue-600 px-4 py-2 rounded">Send Request</button>
      </form>

      {/* FILTERS */}
      <div className="flex gap-4">
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-[#1e293b] p-2 rounded"
        >
          <option value="">All</option>
          <option>Sent</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>

        <input type="date"
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="bg-[#1e293b] p-2 rounded" />

        <input type="date"
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="bg-[#1e293b] p-2 rounded" />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No requests</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="bg-[#1e293b] p-4 rounded-xl">
              <div className="flex justify-between">
                <h2>{r.title}</h2>
                <StatusBadge status={r.status} />
              </div>

              <p className="text-gray-400">{r.message}</p>

              <p className="text-sm mt-2">
                To: {r.toCityManager?.fullName}
              </p>

              {r.remarks && (
                <p className="text-green-400 mt-2">
                  Response: {r.remarks}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {requests.length > 9 && (<div className="flex gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          Prev
        </button>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>)}

    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Sent: "bg-yellow-500",
    Accepted: "bg-green-500",
    Rejected: "bg-red-500"
  };

  return (
    <span className={`${colors[status]} px-2 py-1 rounded text-sm`}>
      {status}
    </span>
  );
};



export default TeamLeadRequests;

