import React from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
export default function ContactUs() {

  const navigate = useNavigate();

  const handleDonateNow = () => {
    console.log("hhhh");
    
    navigate('/payment');

  }

  return (
    <div className='md:mx-20 mx-2 mb-2 mt-5'>
      <h1 className='text-center text-4xl font-bold m-4 text-[#4D4D4D]'>Contact Us</h1>
      <div className="p-4">
      <div className="grid lg:grid-cols-2  items-start gap-12 p-8 mx-auto max-w-5xl max-lg:max-w-2xl bg-[#f8f9fa] [box-shadow:0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md ">
         <form className="space-y-4">
          <input type='text' placeholder='Name'
            className="w-full  rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-0 focus:border-black" />
          <input type='email' placeholder='Email'
            className="w-full  rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-0 focus:border-black" />
          
          <textarea placeholder='Message' rows="6"
            className="w-full rounded-md px-4 border border-gray-300 text-sm pt-2.5 outline-0 focus:border-black"></textarea>
          <button type='button'
            className="text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium px-4 py-2.5 w-full cursor-pointer border-0 mt-2">Send message</button>
        </form>
        <div>
          <h2 className="text-slate-900 text-3xl font-bold">Support Our Mission</h2>
          <p className="text-[15px] text-slate-600 mt-4 leading-relaxed">Help Us Improve Our Communities! </p>
          <p className="text-[15px] text-slate-600 mt-4 leading-relaxed">A small donation can make a big difference in improving local communities. <br /> Help us continue our work. <br /> Donate today and be the part of change. </p>
          
          <Link to={"payment"}>
          <button
            
            className="text-white bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium px-4 py-4 cursor-pointer border-0  mt-5">Donate Now</button>
          </Link>

         
        </div>

       
      </div>
    </div>
    </div>
  )
}
