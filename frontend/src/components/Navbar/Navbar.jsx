import React from "react";

const Navbar = () => {
  return (
    <div className="h-28 flex items-center px-8 bg-teal-50 shadow-md">
      {" "}
      {/* Navbar container */}
      <div className="h-28 w-48">
        {" "}
        {/* Slightly smaller than navbar */}
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="w-full h-full object-contain" /* Image fits in box */
        />
      </div>
    </div>
  );
};

export default Navbar;
