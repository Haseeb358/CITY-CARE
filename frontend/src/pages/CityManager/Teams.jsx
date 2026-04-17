import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateTeamModal from "../../components/Teams/CreateTeamModal";
import TeamFilters from "../../components/Teams/TeamFilters";
import TeamTable from "../../components/Teams/TeamTable";
import TeamModal from "../../components/Teams/TeamModal";
import Pagination from "../../components/TeamLead/Pagination";
import Loader from "../../components/utilities/Loader";

let API_URL = import.meta.env.VITE_API_URL;
let ROUTE = import.meta.env.VITE_API_CITY_MANAGER_ROUTE;

const Teams = () => {

  const { user } = useSelector(state => state.user);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({
    teamName: "",
    zoneName: "",
    memberName: ""
  });

  const [debounced, setDebounced] = useState(filters);
  const [teams, setTeams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");

  // ✅ debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters), 500);
    return () => clearTimeout(t);
  }, [filters]);

  const fetchTeams = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API_URL}${ROUTE}/city/teams`, {
  withCredentials: true,
  params: {
    ...debounced,
    page,
    limit: 10,
    city: user?.emCity   // ✅ "Lahore"
  }
});
     console.log("Fetched teams: ", data);
      setTeams(data.teams);
      setTotalPages(data.totalPages);

    } catch (err) {
      console.error(err.response?.data || "An error occurred while fetching teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [debounced, page]);

  return (
    <div className="p-4 max-w-7xl mx-auto">

      <Loader isOpen={loading} />

      <TeamFilters filters={filters} setFilters={setFilters} />
      <button
  onClick={() => setShowCreate(true)}
  className="mb-3 bg-blue-600 text-white px-4 py-2 rounded"
>
  + Create Team
</button>
      <TeamTable
        teams={teams}
        onView={(team) => {
          setSelected(team);
          setMode("view");
        }}
        onUpdate={(team) => {
          setSelected(team);
          setMode("update");
        }}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {selected && (
        <TeamModal
          team={selected}
          mode={mode}
          onClose={() => setSelected(null)}
        />
      )}
      {showCreate && (
  <CreateTeamModal
    onClose={() => setShowCreate(false)}
    city={user?.emCity}   // 👈 Lahore
    onCreated={fetchTeams} // 👈 refresh UI
  />
)}
    </div>
  );
};

export default Teams;