import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useGetCities from "../../hooks/useGetCities";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const EmployeeAccountFilters = ({ filters, setFilters }) => {

  const { user } = useSelector((state) => state.user);
  const [cities, setCities] = useState([]);
   let fetchedCities = useGetCities();

  useEffect(() => {
    setCities(fetchedCities);
  }, [fetchedCities]);
  
  const handleChange = (e) => {
    
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      role: "",
      cnic: "",
      zone: "",
      isActive: ""
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 grid md:grid-cols-5 gap-3">

      {/* CNIC SEARCH */}
      <input
        type="text"
        name="cnic"
        placeholder="Search CNIC..."
        value={filters.cnic}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      {/* ZONE SEARCH */}
      <input
        type="text"
        name="zone"
        placeholder="Search Zone..."
        value={filters.zone}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      {/* ROLE */}
      <select
        name="role"
        value={filters.role}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="cityManager">City Manager</option>
        <option value="teamLead">Team Lead</option>
      </select>

      {/* CITY */}
      {user?.roleUser === "admin" ? (
        <select
          name="city"
          value={filters.city}
          onChange={handleChange}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Cities</option>

          {cities.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={user?.city?.name || ""}
          disabled
          className="border p-2 rounded text-sm bg-gray-100"
        />
      )}

      {/* isactive dropdown */}
      <select
        name="isActive"
        value={filters.isActive}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      >
        <option value="">All Statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      {/* RESET */}
      <button
        onClick={resetFilters}
        className="bg-gray-200 text-sm rounded px-3 py-2"
      >
        Reset
      </button>

    </div>
  );
};

export default EmployeeAccountFilters;