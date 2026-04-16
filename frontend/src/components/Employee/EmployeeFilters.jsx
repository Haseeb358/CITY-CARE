import axios from "axios";
import React,{useEffect,useState} from "react";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;
import useGetCities from "../../hooks/useGetCities";
// import useGetCityForCityManger from "../../hooks/useGetCityForCityManger";
const EmployeeFilters = ({ filters, setFilters, resetFilters, user }) => {
   console.log("EmployeeFilters - user:", user);
  const [DropDowncities, setDropDowncities] = useState([]);
  let [cityManagerCity, setCityManagerCity] = useState(null);
  const cities = useGetCities();
  // const city = useGetCityForCityManger(user?._id);

  useEffect(() => {
    setDropDowncities(cities);
    
  }, [cities ]);

  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">

      {/* CNIC */}
      <input
        name="cnic"
        placeholder="Search CNIC"
        value={filters.cnic}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      {/* FULL NAME */}
      <input
        name="fullName"
        placeholder="Search Full Name"
        value={filters.fullName}
        onChange={handleChange}
        className="p-2 border rounded"
      />

      {/* SKILL */}
      <input
        name="skill"
        placeholder="Search Skill"
        value={filters.skill}
        onChange={handleChange}
        className="p-2 border rounded"
      />

      {/* ZONE */}
      <input
        name="zone"
        placeholder="Search Zone"
        value={filters.zone}
        onChange={handleChange}
        className="p-2 border rounded"
      />

      {/* ROLE */}
      <select
        name="role"
        value={filters.role}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Roles</option>
        <option value="teamLead">Team Lead</option>
        <option value="worker">Worker</option>
        <option value="cityManager">City Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* CITY */}
      {/* drop down menu*/}
      
      {user?.roleUser === "admin" && (
        <select
        name="city"
        value={filters.city}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Cities</option>
        {DropDowncities.map((city) => (
          <option key={city._id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      )}
        {/* give dropdown */}
      
  
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

export default EmployeeFilters;