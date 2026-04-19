const DonationFilters = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-3 mb-4">

      {["today", "week", "month", "year"].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded ${
            filter === f
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {f.toUpperCase()}
        </button>
      ))}

    </div>
  );
};

export default DonationFilters;