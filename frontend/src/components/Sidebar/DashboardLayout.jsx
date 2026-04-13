import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
// Reusable Sidebar Item
// const SidebarItem = ({ to, icon, label }) => {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
//           isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
//         }`
//       }
//     >
//       {icon}
//       <span className="whitespace-nowrap">{label}</span>
//     </NavLink>
//   );
// };

// // Sidebar Component (Reusable)
// const Sidebar = ({ isOpen, toggleSidebar, menuItems }) => {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 
//       ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b">
//         <h2 className="text-xl font-bold">Dashboard</h2>
//         <button onClick={toggleSidebar}>
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//       </div>

//       {/* Menu */}
//       <div className="p-4 space-y-2">
//         {menuItems.map((item, index) => (
//           <SidebarItem key={index} {...item} />
//         ))}
//       </div>
//     </div>
//   );
// };

// Layout Component (IMPORTANT)
export default function DashboardLayout({ menuItems }) {
  let user = useSelector((state) => state?.user);
  console.log("User in DashboardLayout: ", user);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  let closeSidebar = () => setIsOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        menuItems={menuItems}
        closeSidebar={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <button onClick={toggleSidebar} className="text-xl">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="text-lg font-semibold mr-10 ">
            {/* if user.roleUser is team Lead there should be Team Lead panel */}
            {user?.user?.roleUser === "teamLead" && "Team Lead Panel"}
            {user?.user?.roleUser === "admin" && "Admin Panel"}
            {user?.user?.roleUser === "cityManager" && "City Manager Panel"}
          </h1>
        </div>

        {/* Page Content */}
        <div className="p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


// =========================
// Example Usage
// =========================

/*
import DashboardLayout from "./DashboardLayout";
import { FaHome, FaClipboardList } from "react-icons/fa";

const teamLeadMenu = [
  { to: "/team/dashboard", label: "Dashboard", icon: <FontAwesomeIcon icon={faHome} /> },
  { to: "/team/complaints", label: "Complaints", icon: <FontAwesomeIcon icon={faClipboardList} /> },
];

<Route element={<ProtectedRoute allowedRoles={["team_lead"]} />}>
  <Route element={<DashboardLayout menuItems={teamLeadMenu} />}>
    <Route path="team/dashboard" element={<TeamDashboard />} />
    <Route path="team/complaints" element={<TeamComplaints />} />
  </Route>
</Route>
*/
