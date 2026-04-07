import { useState } from "react";
import "leaflet/dist/leaflet.css";
import FileUpload from "./FileUpload";
import SuccessMessage from "./SuccessMessage";
import { reverseGeocode } from "../../utils/reverseGeocode";
import useGeolocation from "../../hooks/useGeolocation";
import LocationPicker from "./LocationPicker";
import MapModal from "./MapModal";
let VITE_API_URL = import.meta.env.VITE_API_URL;
let VITE_API_COMPLAINANT_ROUTE = import.meta.env.VITE_API_COMPLAINANT_ROUTE;
import axios from "axios";
import Loader from "../utilities/Loader";
import { useEffect } from "react";

export default function ComplaintForm() {
  const initialFormData = {
    category: "",
    city: "",
    description: "",
    address: "",
    location:{lat:null, lng:null}
  };
  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [marker, setMarker] = useState(null);
  const [msgFromApi, setMsgFromApi] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loactionLoading, setLocationLoading] = useState(false);
  let [ctg, setCtg] = useState(null);


  const userLocation = useGeolocation();

  const resetForm = () => {
    setSubmitted(false);
    setFormData(initialFormData);
    setFiles([]);
  };

  const confirmLocation = async () => {
    if (!marker) {
      alert("Please select a location");
      return;
    }

    const [lat, lng] = marker;

    const address = await reverseGeocode(lat, lng);
    setFormData((prev) => ({
      ...prev,
      location: { lat, lng },
      address,
    }));

    setShowMap(false);
  };

  const setCurrentLocation = async () => {
      setLocationLoading(true);
      if (!userLocation) {
        alert("Unable to fetch current location. Please allow location access and try again.");
        return;
      }
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const address = await reverseGeocode(userLocation[0], userLocation[1]);

    setFormData((prev) => ({
      ...prev,
      location: { lat: userLocation[0], lng: userLocation[1] },
      address,
    }));
    setLocationLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
     console.log("Submitting form with data:", formData);
     console.log("Files to upload:", files);
    let link=`${VITE_API_URL}${VITE_API_COMPLAINANT_ROUTE}/create-complaint`
    let form = new FormData();
    form.append("city", formData.city);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("addressDescription", formData.address);
    form.append("location", JSON.stringify({lng:formData.location.lng, lat:formData.location.lat}));
    if(files.length>0){
      // append each file to form data
      files.forEach((file, index) => {
        form.append("files", file);
      });
    }
    
    axios.post(link, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("Complaint submitted successfully:", response.data);
      setSubmitted(true);
      setMsgFromApi(response.data.message);
      setStatus(response.data.status);

    })
    .catch((error) => {
      setSubmitted(true);
      setMsgFromApi(error.response?.data?.message || "Failed to submit complaint. Please try again.");
      setStatus(error.response?.data?.status);
      
      
    })
    .finally(() => {
      setLoading(false);
    });



  };

  useEffect(() => {
    // Fetch complaint categories from the API
    axios.get(`${VITE_API_URL}${VITE_API_COMPLAINANT_ROUTE}/complaint-categories`)
      .then((response) => {
        setCtg(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching complaint categories:", error);
      });
  }, []);

  if (submitted) {
    return <SuccessMessage resetForm={resetForm} msg={msgFromApi} status={status} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Loader isOpen={loading}></Loader>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Submit a Complaint
          </h1>
          <p className="mt-2 text-gray-600">
            We take your concerns seriously. Please provide detailed information
            about your complaint.
          </p>
        </div>

        {showMap && (
          <MapModal
            userLocation={userLocation}
            marker={marker}
            setMarker={setMarker}
            confirmLocation={confirmLocation}
            onCancel={() => setShowMap(false)}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8"
        >
          {/* Complaint Details Header */}
          <div>
            <h2 className="text-lg font-semibold text-amber-600 border-b border-gray-200 pb-2">
              Complaint Details
            </h2>
          </div>

          {/* Complaint Details */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a category</option>
                  {ctg && ctg.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a City</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Muridke">Muridke</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Please provide a detailed description of your complaint, including dates, times, and any relevant circumstances..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <LocationPicker
              formData={formData}
              handleChange={handleChange}
              setCurrentLocation={setCurrentLocation}
              setShowMap={setShowMap}
              locationLoading={loactionLoading}
            />
          </div>

          {/* Additional Information */}
          <div>
            <div className="space-y-4">
              <FileUpload files={files} onFilesChange={setFiles} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-amber-500 cursor-pointer text-white font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
