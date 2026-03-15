export const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      return data.display_name
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return null;
    }
  };