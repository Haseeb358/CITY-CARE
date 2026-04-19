import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useGetCities from "../../hooks/useGetCities";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;

const UploadZoneModal = ({ onClose, onSuccess }) => {

  const [file, setFile] = useState(null);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   
  const fetchedCities = useGetCities();
  // 🔥 fetch cities
  useEffect(() => {
    
    setCities(fetchedCities);

  }, [fetchedCities]);

  // 🔥 FILE VALIDATION (FRONTEND)
  const validateFile = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!json.features || !Array.isArray(json.features)) {
        throw new Error("Invalid GeoJSON: missing features array");
      }

      for (let i = 0; i < json.features.length; i++) {
        const f = json.features[i];

        if (!f.properties?.name) {
          throw new Error(`Feature ${i + 1}: Missing name`);
        }

        if (!f.geometry?.type || !f.geometry?.coordinates) {
          throw new Error(`Feature ${i + 1}: Invalid geometry`);
        }
      }

      return true;

    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a file");
    if (!city) return setError("Please select a city");

    const isValid = await validateFile(file);
    if (!isValid) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("cityId", city);

      await axios.post(
        `${API_URL}${API_ADMIN_ROUTE}/zones/upload`,
        formData,
        { withCredentials: true }
      );

      onSuccess();
      onClose();
     toast.success("Zones uploaded successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-125">

        <h2 className="text-lg font-semibold mb-3">
          Upload Zones (GeoJSON)
        </h2>

        {/* HINT */}
        <div className="bg-gray-50 border rounded p-4 text-xs mb-4">

  <p className="font-semibold mb-2 text-gray-700">
    📌 GeoJSON File Requirements
  </p>

  <ul className="list-disc pl-4 space-y-1 text-gray-600">
    <li>Must be a valid <b>JSON / GeoJSON</b> file</li>
    <li>Top-level must contain <b>features[]</b> array</li>
    <li>Each feature must include:</li>
    <ul className="list-disc pl-4">
      <li><b>properties.name</b> (Zone name)</li>
      <li><b>geometry.type</b> (e.g., Polygon)</li>
      <li><b>geometry.coordinates</b> (array of coordinates)</li>
    </ul>
  </ul>

  {/* MINI EXAMPLE */}
  <div className="mt-3 bg-gray-100 p-2 rounded text-[11px] overflow-x-auto">
{`{
  "type": "FeatureCollection",
  "features": [
    {
      "properties": { "name": "Zone A" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], [lng, lat], ...]]
      }
    }
  ]
}`}
  </div>

</div>

        {/* CITY */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select City</option>
          {cities.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* FILE */}
        <input
          type="file"
          accept=".json,.geojson"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-200 px-3 py-1 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadZoneModal;