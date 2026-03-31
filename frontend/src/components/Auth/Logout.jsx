import React from 'react'
import { NavLink } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL;
const userRoute = import.meta.env.VITE_API_USER_ROUTE;
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../feature/user/userSlice.js";
// toast
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Logout() {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let link = `${apiUrl}${userRoute}/logout`;
      await axios.post(link, {}, { withCredentials: true });
      dispatch(logout());
        toast.success("Logged out successfully!");
        navigate("/");
    } catch (error) {
      toast.error(error.message || "Error occurred while logging out. Please try again.");
      console.error("Error occurred while logging out:", error);
    }
  };


  return (
    <>
      <button className="sm:text-lg font-medium cursor-pointer
        " onClick={handleLogout}>
        Logout
      </button>
    </>
  )
}
