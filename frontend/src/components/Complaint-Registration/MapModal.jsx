import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const MapModal = ({ userLocation, marker, setMarker, confirmLocation, onCancel }) => {


    function MapClickHandler() {
    useMapEvents({
      click(e) {
        setMarker([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-[80vh] md:w-[80vw] rounded-lg overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />

          {marker && <Marker position={marker} />}
        </MapContainer>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => confirmLocation()}
            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
