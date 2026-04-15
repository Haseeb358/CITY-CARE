import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../components/utilities/Loader";
import EmployeeAccountTable from "../../components/AccountsEmployee/EmployeeAccountTable";
import Pagination from "../../components/TeamLead/Pagination";
import EmployeeAccountFilters from "../../components/AccountsEmployee/EmployeeAccountFilters";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const EmployeesWithAccounts = () => {
  const { user } = useSelector((state) => state.user);
  let [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    role: "",
    cnic: "",
    zone: "",
    isActive: ""
  });

  const [debounced, setDebounced] = useState({
    cnic: "",
    zone: ""
  });

  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced({
        cnic: filters.cnic,
        zone: filters.zone
      });
    }, 400);

    return () => clearTimeout(t);
  }, [filters.cnic, filters.zone]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      
      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/employees/accounts`,
        {
          params: {
            ...filters,
            ...debounced,
            page,
            limit: 10
          },
          withCredentials: true
        }
      );
     console.log("dt:: ",data.employees)
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);

    }
  };

  
  useEffect(() => {
    fetchEmployees(page);
  }, [filters.city, filters.role, filters.isActive, debounced, page]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Loader isOpen={loading} />
      <EmployeeAccountFilters
        filters={filters}
        setFilters={setFilters}
      />

      <EmployeeAccountTable
        employees={employees}
        refresh={fetchEmployees}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

    </div>
  );
};

export default EmployeesWithAccounts;