import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Auth/Logout";
import { useSelector } from "react-redux";
export default function DropDown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  let user= useSelector((state) => state?.user?.user);
  let fullName = user?.fullName || "User";
//   trim it until first space
  fullName = fullName.split(" ")[0];

  let goToProfile = () => {
    navigate("/user-profile");
    setOpen(false);
  }

  return (
    // dropdown open on click and close on click 
    <div
      className="relative inline-flex m-1"
        onClick={() => setOpen(!open)}

    >
      {/* Button */}
      <button
        type="button"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-gray-100 border border-gray-300 text-gray-800 shadow-sm hover:bg-gray-200 focus:outline-none"
      >
        {fullName}
        <svg
          className={`size-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-30 bg-white border border-gray-200 shadow-md rounded-lg z-50">
          <div className="p-1 space-y-0.5 ">
            <button
              onClick={goToProfile}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
            >
              Profile
            </button>
            <div
              
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
            >
              <Logout></Logout>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}