
import axios from "axios";
import React,{useEffect,useState} from "react";
let API_URL = import.meta.env.VITE_API_URL;
let API_ADMIN_ROUTE = import.meta.env.VITE_API_ADMIN_ROUTE;
export default function useGetCities() {
  const [cities, setCities] = useState([]);

  const fetchCities = async () => {
    try {
        
        let response = await axios.get(`${API_URL}${API_ADMIN_ROUTE}/cities`, { withCredentials: true });
        setCities(response.data.cities);
        
    } catch (error) {
        console.error("Error fetching cities:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return cities;
}

  
