import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function HeroSection() {
  const navigate = useNavigate()

  const handleReportComplaint = () => {
    navigate('/register-complaint')
  }
  const handleTrackComplaint = () => {
    navigate('/track-complaint')
  }

  return (
    <div className=" grid lg:grid-cols-2 bg-[#F5F7FA] gap-4">
      
      <div className='flex flex-col gap-4 justify-start items-start md:p-16 p-5 lg:p-24 ml-5  '>
        <h1 className='text-lg md:text-2xl lg:text-4xl font-bold'>Report Civic Problems</h1>
        <h1 className='text-lg md:text-2xl lg:text-4xl font-bold'>Improve Your Community</h1>
        <p className='text-sm  md:text-lg'>Easily Report Issuses Like Potholes,Street Lights and Garbage in your area</p>
        <div className='flex flex-col sm:flex-row justify-center items-start md:gap-8 gap-4'>
            <button  className='bg-blue-500 text-white px-4 py-2 rounded text-sm lg:text-lg' onClick={handleReportComplaint}>
              Report Complaint
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded text-sm lg:text-lg' >
              Track Complaint
            </button>
        </div>
      </div>
      
      <div className='md:w-full md:h-132 p-5 mx-auto '>
        <img src="/src/assets/hero-image.png" alt="hero" className='w-full h-full rounded-2xl object-cover'/>
      </div>
      
    </div>
  )
}
