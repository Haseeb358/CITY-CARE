import React from "react";

const Navbar = () => {
  return (
    <div className="h-28 flex items-center px-8 bg-teal-50 shadow-md">
      <a href="/">
        <div className="h-28 w-48">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="w-full h-full object-contain" /* Image fits in box */
          />
        </div>
      </a>
    </div>
  );
};

export default Navbar;
