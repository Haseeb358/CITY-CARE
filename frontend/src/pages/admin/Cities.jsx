import { useEffect, useState } from "react";
import axios from "axios";
import CityFilters from "../../components/admin/CityFilters";
import CityTable from "../../components/admin/CityTable";
import CreateCityModal from "../../components/admin/CreateCityModal";
import Loader from "../../components/utilities/Loader";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const Cities = () => {

  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // ✅ debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchCities = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/all-cities`,
        {
          params: {
            search: debouncedSearch,
            status: filters.status
          },
          withCredentials: true
        }
      );

      setCities(data.cities);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [debouncedSearch, filters.status]);

  return (
    <div className="p-4 max-w-6xl mx-auto">

      <Loader isOpen={loading} />

      <CityFilters
        filters={filters}
        setFilters={setFilters}
      />

      <button
        onClick={() => setShowCreate(true)}
        className="my-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create City
      </button>

      <CityTable cities={cities} refresh={fetchCities} />

      {showCreate && (
        <CreateCityModal
          onClose={() => setShowCreate(false)}
          refresh={fetchCities}
        />
      )}
    </div>
  );
};

export default Cities;