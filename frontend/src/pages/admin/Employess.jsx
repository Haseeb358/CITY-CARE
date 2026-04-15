import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import EmployeeFilters from "../../components/Employee/EmployeeFilters";
import axios from "axios";
import Pagination from "../../components/TeamLead/Pagination";
import Loader from "../../components/utilities/Loader";
import CreateEmployeeModal from "../../components/Employee/CreateEmployeeModal";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;
const Employees = () => {
  const { user } = useSelector((state) => state.user);

  const defaultFilters = {
    cnic: "",
    skill: "",
    zone: "",
    city: "",
    role: "",
    fullName: "",
  };
  

  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  let [loading,setLoading]=useState(false)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      // use axios with credentials to send a GET request to fetch employees based on filters and pagination
      const { data } = await axios.get(`${API_URL}${API_ADMIN_ROUTE}/employees`, {
        params: {
          ...debouncedFilters,
          city: filters.city,
          role: filters.role,
          page,
          limit: 10
        },
        withCredentials: true
      });
      console.log("data:",data);
      setLoading(false)
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      
    } catch (err) {
      console.error(err.response?.data || err.message );
      setLoading(false)
    }
  };
 useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedFilters(filters);
    setPage(1); // reset page on search
  }, 1000); // 5000ms delay

  return () => clearTimeout(timer);
}, [filters.cnic, filters.skill, filters.zone,filters.fullName]);

  useEffect(() => {
  fetchEmployees();
}, [debouncedFilters, filters.city, filters.role, page]);
 
  
  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
    <Loader isOpen={loading} />
      <EmployeeFilters
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        user={user}
      />

      {user?.roleUser === "admin" && (
        <button
          onClick={() => setShowCreate(true)}
          className="my-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Employee
        </button>
      )}

      <EmployeeTable employees={employees} user={user} setEmployees={setEmployees}
        refreshEmployees={fetchEmployees}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {showCreate && (
        <CreateEmployeeModal onClose={() => setShowCreate(false) } onCreated={() => fetchEmployees()}  />
      )}
    </div>
  );
};

export default Employees;