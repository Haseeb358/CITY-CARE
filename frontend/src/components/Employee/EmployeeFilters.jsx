const EmployeeFilters = ({ filters, setFilters, resetFilters, user }) => {

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
      
      <select
        name="city"
        value={filters.city}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">All Cities</option>
        <option value="Lahore">Lahore</option>
        <option value="Karachi">Karachi</option>
        
      </select>

      {/* {user?.roleUser === "admin" && (
        <input
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      )} */}

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