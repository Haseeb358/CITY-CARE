import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminKPIs from '../../components/admin/AdminKPIs';
import { ComplaintsOverTimeChart, ComplaintsByStatusChart } from '../../components/admin/AdminCharts';
import { ComplaintsByCategoryList, TeamPerformanceTable } from '../../components/admin/AdminLayoutElements';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterOptions, setFilterOptions] = useState({ cities: [], categories: [] });

  // Filters
  const [timeFilter, setTimeFilter] = useState('last30days');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/admin/analytics?timeFilter=${timeFilter}&city=${cityFilter}&category=${categoryFilter}`;

      const response = await axios.get(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error("Dashboard error", err);
      setError('An error occurred while fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/admin/filter-options`;
      const response = await axios.get(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch filter options", err);
    }
  };

  const handleExportPDF = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const endpoint = `${apiUrl}/api/admin/generate-report?timeFilter=${timeFilter}&city=${cityFilter}&category=${categoryFilter}`;
  window.open(endpoint, '_blank');
};

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter, cityFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#121212] w-full p-6 text-white font-sans overflow-y-auto w-full max-w-full">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Header Title */}
        <h1 className="text-2xl font-bold mb-6 text-white tracking-wide">Complaint analytics</h1>

        {/* Filters and Exports */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-3/5">
            <select
              className="bg-[#1e1e1e] border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none hover:border-gray-500 transition-colors"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last3months">Last 3 months</option>
              <option value="alltime">All time</option>
            </select>
            <select
              className="bg-[#1e1e1e] border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none hover:border-gray-500 transition-colors"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All cities</option>
              {filterOptions.cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
            <select
              className="bg-[#1e1e1e] border border-gray-700 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none hover:border-gray-500 transition-colors"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {filterOptions.categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-[#1e1e1e] cursor-pointer hover:bg-gray-700 text-gray-200 border border-gray-600 font-medium rounded-md text-sm px-5 py-2.5 transition-colors shadow-sm"
            >
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/40 border border-red-500 text-red-100 px-4 py-3 rounded w-full">
            {error} (Ensure you are logged in as admin)
          </div>
        ) : (data ? (
          <>
            {/* KPI Cards */}
            <AdminKPIs overview={data.overview} />

            {/* Visual Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 shadow-lg max-w-full">
                <h3 className="text-gray-200 font-bold mb-6">Complaints over time</h3>
                <ComplaintsOverTimeChart data={data.complaintAnalytics?.overTime} />
              </div>

              {/* Donut Chart */}
              <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 shadow-lg max-w-full">
                <h3 className="text-gray-200 font-bold mb-6">By status</h3>
                <ComplaintsByStatusChart data={data.complaintAnalytics?.byStatus} />
              </div>
            </div>

            {/* List and Table Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 w-full overflow-hidden">
              {/* Category List */}
              <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 shadow-lg h-auto min-h-[300px]">
                <h3 className="text-gray-200 font-bold mb-6">Complaints by category</h3>
                <div className="pr-4">
                  <ComplaintsByCategoryList data={data.complaintAnalytics?.byCategory} />
                </div>
              </div>

              {/* Team Performance Table */}
              <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 shadow-lg overflow-x-auto min-h-[300px]">
                <h3 className="text-gray-200 font-bold mb-6">Team performance</h3>
                <TeamPerformanceTable data={data.teamPerformance?.leaderboard} />
              </div>
            </div>
          </>
        ) : null)}
      </div>
    </div>
  );
};

export default AdminDashboard;
