import React from 'react'
import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon, label, closeSidebar }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
        }`
      }
      onClick={closeSidebar}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </NavLink>
  )
}
