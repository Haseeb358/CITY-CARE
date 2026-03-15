import { useState, useEffect } from "react";

export default function useGeolocation() {
  const [location, setLocation] = useState([31.5204, 74.3587]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return location;
}