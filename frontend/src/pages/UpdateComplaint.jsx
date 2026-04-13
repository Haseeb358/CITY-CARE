import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
let apiUrl = import.meta.env.VITE_API_URL;
let teamLeadRoute = import.meta.env.VITE_API_TEAMLEAD_ROUTE;
import ComplaintCard from "../components/TeamLead/ComplaintCard";
import { toast } from "react-hot-toast";
import Loader from "../components/utilities/Loader";


const UpdateComplaint = () => {
  const { id } = useParams();
  
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]); 
  let [loading, setLoading] = useState(false);
  

  const fetchData = async () => {
    try {
      
      console.log("Fetching complaint details for ID: ", id);
        let response = await axios.get(`${apiUrl}${teamLeadRoute}/complaints/${id}`, {
            withCredentials: true,
        });
        console.log("Complaint details fetched: ", response);
        setComplaint(response.data?.complaint);
        setHistory(response.data?.history);
        setStatus(response?.data.complaint?.CurrentStatus);
        
    } catch (err) {
      console.error(err.response?.data || "An error occurred while fetching complaint details.");
       
     toast.error("Failed to load complaint details. Please try again.");
     // Optionally, navigate back to complaints list if fetch fails
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {

  setFiles([...e.target.files]);
};

  const handleUpdate = async () => {
  try {
     setLoading(true);
    const formData = new FormData();
    
    formData.append("status", status);
    formData.append("remarks", remarks);

    // file are requried alert the user if status is resolved and no files are selected
    if (status === "Resolved" && files.length === 0) {
      alert("Please upload proof images when marking as Resolved.");
      return;
    }
    if(remarks.trim() === "" ) {
      alert("Please enter remarks before updating.");
      return;
    }
    if(remarks.trim().length >100) {
      alert("Remarks should be less than 100 characters.");
      return;
    }
    // 🔥 Append files only if resolved
    if (status === "Resolved") {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
     console.log("Updating complaint with data: ", {
      status,
      remarks,
      files,
    });
    if(status !== "Resolved" && files.length > 0) {
      // set files to empth in  arrow functional state update way
       
      setFiles((prevFiles) => []); // Clear files if not resolved
      
    }
    await axios.put(`${apiUrl}${teamLeadRoute}/complaints/${id}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    fetchData();
    setRemarks("");
    setFiles([]);
    setLoading(false);
    toast.success("Complaint status updated successfully!");
    

  } catch (err) {
     console.error(err.response?.data || "An error occurred while updating complaint status.");
      setLoading(false);
      toast.error("Failed to update complaint status. Please try again.");
    }
};

  if (!complaint) return <Loader isOpen={true} />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">

      

      {/* 🔥 Complaint Card */}
      {/* <div className="border p-4 rounded shadow">
        <h2 className="font-bold text-lg">{complaint.category}</h2>
        <p>{complaint.description}</p>
        <p className="text-sm text-gray-500">
          {complaint.zone?.name} | {complaint.city?.name}
        </p>
        <p>Status: {complaint.CurrentStatus}</p>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ComplaintCard complaint={complaint} btndisabled={true} />
      </div>
    <Loader isOpen={loading} />
      {/* 🔥 Update Section */}
      <div className="border p-4 rounded space-y-3">

       {/* STATUS DROPDOWN */}
<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="p-2 border rounded w-full"
>
  <option>Assigned</option>
  <option>In-Progress</option>
  <option>Resolved</option>
  <option>Rejected</option>
  <option>Review</option>
</select>

{/* 🔥 SHOW ONLY WHEN RESOLVED */}
{status === "Resolved" && (
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Upload Proof Image
    </label>

    <input
      type="file"
      multiple
      onChange={handleFileChange}
      className="w-full border p-2 rounded"
    />

    {/* Preview */}
    <div className="flex gap-2 flex-wrap">
      {files.map((file, i) => (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          className="w-20 h-20 object-cover rounded"
        />
      ))}
    </div>
  </div>
)}
    <textarea
          placeholder="Enter remarks..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update Status
        </button>
      </div>

      {/* 🔥 HISTORY */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-3">History</h3>

        {history.length === 0 ? (
          <p>No history found</p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h._id} className="border p-2 rounded text-sm">
                <p>
                  <b>{h.oldStatus}</b> → <b>{h.newStatus}</b>
                </p>
                <p>{h.remarks}</p>
                <p className="text-xs text-gray-500">
                  {new Date(h.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UpdateComplaint;