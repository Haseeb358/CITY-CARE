const TeamFilters = ({ filters, setFilters }) => {

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">

      <input
        placeholder="Search Team Name"
        value={filters.teamName}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, teamName: e.target.value }))
        }
        className="border p-2 rounded"
      />

      <input
        placeholder="Search Zone Name"
        value={filters.zoneName}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, zoneName: e.target.value }))
        }
        className="border p-2 rounded"
      />

      <input
        placeholder="Search Leader/Member"
        value={filters.memberName}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, memberName: e.target.value }))
        }
        className="border p-2 rounded"
      />

    </div>
  );
};

export default TeamFilters;