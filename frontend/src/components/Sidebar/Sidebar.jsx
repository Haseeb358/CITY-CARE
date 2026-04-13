import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes,} from "@fortawesome/free-solid-svg-icons";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {  useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import { logout } from "../../feature/user/userSlice.js";
import SidebarItem from './SidebarItem';

export default function Sidebar({ isOpen, toggleSidebar, menuItems ,closeSidebar}) {
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 flex flex-col justify-between`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} {...item } closeSidebar={closeSidebar}  />
          ))}
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-100 transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
