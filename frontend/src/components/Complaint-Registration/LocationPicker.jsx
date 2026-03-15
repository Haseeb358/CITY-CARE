
const LocationPicker = ({
  formData,
  handleChange,
  setCurrentLocation,
  setShowMap,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Location Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Complaint Location <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="button"
            onClick={setCurrentLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Use Current Location
          </button>

          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
          >
            Select From Map
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter location address manually"
          required
          className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md"
        />

        {formData.lat && (
          <p className="text-sm text-gray-500">
            Coordinates: {formData.lat}, {formData.lng}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
