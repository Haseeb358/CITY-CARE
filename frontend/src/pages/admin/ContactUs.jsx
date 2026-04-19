import { useEffect, useState } from "react";
import axios from "axios";
import ContactFilters from "../../components/ContactHistory/ContactFilters";
import ContactTable from "../../components/ContactHistory/ContactTable";
import MessageModal from "../../components/ContactHistory/MessageModal";
import Pagination from "../../components/TeamLead/Pagination";
import Loader from "../../components/utilities/Loader";

let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const ContactUs = () => {

  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("month");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/contact`,
        {
          params: { filter, page, limit: 10 },
          withCredentials: true
        }
      );

      setMessages(data.messages);
      setTotalPages(data.totalPages);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter, page]);

  const exportData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}${API_ADMIN_ROUTE}/contact/export`,
        {
          params: { filter },
          responseType: "blob",
          withCredentials: true
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "contact_messages.xlsx";
      a.click();

    } catch {
      alert("Export failed");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">

      <Loader isOpen={loading} />

      <ContactFilters
        filter={filter}
        setFilter={setFilter}
        onExport={exportData}
      />

      <ContactTable messages={messages} onView={setSelected} />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {selected && (
        <MessageModal message={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default ContactUs;