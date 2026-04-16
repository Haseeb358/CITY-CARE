const CityFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-3 flex-wrap">

      <input
        type="text"
        placeholder="Search city..."
        value={filters.search}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, search: e.target.value }))
        }
        className="border px-3 py-2 rounded"
      />

      <select
        value={filters.status}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, status: e.target.value }))
        }
        className="border px-3 py-2 rounded"
      >
        <option value="">All</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

    </div>
  );
};

export default CityFilters;