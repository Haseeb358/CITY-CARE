import { useEffect, useState } from "react";
import axios from "axios";
import DonationFilters from "../../components/admin/DonationFilters";
import DonationStats from "../../components/admin/DonationStats";
import DonationTable from "../../components/admin/DonationTable";
import Pagination from "../../components/TeamLead/Pagination";
import Loader from "../../components/utilities/Loader";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const Donations = () => {

  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filter, setFilter] = useState("today");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/donations`,
        {
          params: {
            filter,
            page,
            limit: 10
          },
          withCredentials: true
        }
      );

      setDonations(data.donations);
      setTotalAmount(data.totalAmount);
      setTotalPages(data.totalPages);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [filter, page]);

  return (
    <div className="p-4 max-w-6xl mx-auto">

      <Loader isOpen={loading} />

      <DonationFilters filter={filter} setFilter={setFilter} />

      <DonationStats totalAmount={totalAmount} filter={filter} />

      <DonationTable donations={donations} />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

    </div>
  );
};

export default Donations;