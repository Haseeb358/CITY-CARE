import React from 'react'
import { Link,NavLink } from "react-router-dom";
export default function NavLinks() {
  return (
    <>
       <ul className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-9 bg-[#ffffff] p-5 rounded-lg">
        <li>
          <NavLink to={"/"} className={({isActive})=>`sm:text-lg font-medium ${isActive ? "underline text-orange-900 underline-offset-4" : ""}`}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={"about-us"} className={({isActive})=>`sm:text-lg font-medium ${isActive ? "underline text-orange-900 underline-offset-4" : ""}`}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to={"/contact-us"} className={({isActive})=>`sm:text-lg font-medium ${isActive ? "underline text-orange-900 underline-offset-4" : ""}`}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to={"payment"} className={({isActive})=>`sm:text-lg font-medium ${isActive ? "underline text-orange-900 underline-offset-4" : ""}`}>
            Funds Us
          </NavLink>
        </li>
      </ul>
    </>
  )
}
