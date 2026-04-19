import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ZoneFilters from "../../components/admin/ZoneFilters";
import ZoneTable from "../../components/admin/ZoneTable";
import Pagination from "../../components/TeamLead/Pagination";
import UploadZoneModal from "../../components/admin/UploadZoneModal";
import Loader from "../../components/utilities/Loader";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const Zones = () => {
  const { user } = useSelector((state) => state.user);
  let [loading, setLoading] = useState(false);

  const defaultFilters = {
    name: "",
    isActive: "",
    city: ""
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [zones, setZones] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpload, setShowUpload] = useState(false);

  // 🔥 debounce
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(filters.name);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.name]);

  const fetchZones = async () => {
    setLoading(true);
    
    try {
      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/allzones`,
        {
          params: {
            ...filters,
            name: debouncedName,
            page,
            limit: 15
          },
          withCredentials: true
        }
      );
      console.log("Zones Data:", data);
      setLoading(false);
      setZones(data.zones);
      setTotalPages(data.totalPages);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [debouncedName, filters.isActive, filters.city, page]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };
//    IF no zones found show message
   if(zones.length === 0){
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <Loader isOpen={loading} />
        <ZoneFilters
          filters={filters}
          setFilters={setFilters}
         resetFilters={resetFilters}
         user={user}
        />
        <p className="text-center text-gray-500 mt-10">No zones found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
    <Loader isOpen={loading} />
      <ZoneFilters
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        user={user}
      />
      {user?.roleUser === "admin" && (
  <button
    onClick={() => setShowUpload(true)}
    className="my-3 bg-blue-600 text-white px-4 py-2 rounded"
  >
    + Upload Zones (GeoJSON)
  </button>
)}

{showUpload && (
  <UploadZoneModal
    onClose={() => setShowUpload(false)}
    onSuccess={fetchZones}
  />
)}
      <ZoneTable
        zones={zones}
        user={user}
        refresh={fetchZones}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

    </div>
  );
};

export default Zones;