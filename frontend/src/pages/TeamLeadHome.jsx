import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
let apiUrl = import.meta.env.VITE_API_URL;
let teamLeadRoute = import.meta.env.VITE_API_TEAMLEAD_ROUTE;
const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"];

const TeamLeadDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // with credentials to include cookies
      const [s, t, tr] = await Promise.all([
        axios.get(`${apiUrl}${teamLeadRoute}/dashboard`, { withCredentials: true }),
        axios.get(`${apiUrl}${teamLeadRoute}/team-performance`, { withCredentials: true }),
        axios.get(`${apiUrl}${teamLeadRoute}/trend`, { withCredentials: true })
      ]);
      console.log("Dashboard summary: ", s.data);
      console.log("Team performance: ", t.data);
      console.log("Complaint trend: ", tr.data);

      setSummary(s.data);
      setTeams(t.data);
      setTrend(tr.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 space-y-6">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total" value={summary.total} />
        <Card title="Resolved %" value={calcResolution(summary)} />
        <Card title="Avg Time"
          value={(summary.avgResolutionTime / 3600000).toFixed(1) + " hrs"} />
        <Card title="Assigned" value={getStatus(summary, "Assigned")} />
        <Card title="Resolved" value={getStatus(summary, "Resolved")} />
        <Card title="Reassigned" value={getStatus(summary, "Reassigned")} />
        
      </div>

      {/* Trend */}
      <div className="bg-[#1e293b] p-6 rounded-2xl">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <XAxis dataKey="_id.date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line dataKey="count" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col items-center">
          <PieChart width={250} height={250}>
            <Pie data={summary.stats} dataKey="count" innerRadius={60}>
              {summary.stats.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teams}>
              <XAxis dataKey="teamName" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="resolved" fill="#22c55e" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category */}
      <div className="bg-[#1e293b] p-6 rounded-2xl">
        {summary.categoryStats.map((c, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between">
              <span>{c._id}</span>
              <span>{c.count}</span>
            </div>
            <div className="bg-gray-700 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${(c.count / summary.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const getStatus = (summary, status) =>
  summary.stats.find(s => s._id === status)?.count || 0;

const calcResolution = (summary) => {
  const resolved = getStatus(summary, "Resolved");
  return ((resolved / summary.total) * 100).toFixed(0) + "%";
};

const Card = ({ title, value }) => (
  <div className="bg-[#1e293b] p-5 rounded-2xl">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);


export default TeamLeadDashboard;