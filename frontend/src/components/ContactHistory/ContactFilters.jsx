const ContactFilters = ({ filter, setFilter, onExport }) => {
  return (
    <div className="flex justify-between items-center mb-4">

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="today">Today</option>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
      </select>

      <button
        onClick={onExport}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Export Excel
      </button>

    </div>
  );
};

export default ContactFilters;