import { useEffect, useState } from "react";
import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;
import useGetCities from "../../hooks/useGetCities";
const ZoneFilters = ({ filters, setFilters, resetFilters, user }) => {

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

  return (
    <div className="grid md:grid-cols-4 gap-3">
 
      {/* SEARCH */}
      <input
        name="name"
        placeholder="Search Zone..."
        value={filters.name}
        onChange={handleChange}
        className="p-2 border rounded"
      />

      {/* STATUS */}
      <select
        name="isActive"
        value={filters.isActive}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      {/* CITY */}
      {(user?.roleUser === "admin") && (
        <select
          name="city"
          value={filters.city}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">All Cities</option>

          {cities.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {/* RESET */}
      <button
        onClick={resetFilters}
        className="bg-gray-200 px-3 py-2 rounded"
      >
        Reset
      </button>

    </div>
  );
};

export default ZoneFilters;