import React from 'react'

export default function ImpactStats() {
  return (
    <div className='md:mx-20 mx-2 mb-2'>
      <h1 className='text-center text-4xl font-bold m-4 text-[#4D4D4D]'>Impact Stats</h1>
      <p className='text-center mb-4'>Real impact measured by the issues solved and communities served</p>

        <div className='grid md:grid-cols-4 gap-4 p-5'>
            <div className='bg-[#D9D9D9] p-5 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center'>
                <p className='text-4xl font-bold text-[#4D4D4D]'>2000+</p>
              <h1 className='font-bold text-lg sm:text-2xl'>Complaint <br /> Submitted</h1>
              
            </div>
            <div className='bg-[#D9D9D9] p-5 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center'>
              <p className='text-4xl font-bold text-[#4D4D4D]'>1500+</p>
              <h1 className='font-bold text-lg sm:text-2xl'>Issues <br />Resolved</h1>
            </div>
            <div className='bg-[#D9D9D9] p-5 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center'>
              <p className='text-4xl font-bold text-[#4D4D4D]'>100+</p>
              <h1 className='font-bold text-lg sm:text-2xl'>Zones <br /> Coverd</h1>
            </div>
            <div className='bg-[#D9D9D9] p-5 rounded-lg shadow-md flex flex-col gap-2 justify-center items-center'>
              <p className='text-4xl font-bold text-[#4D4D4D]'>100+</p>
              <h1 className='font-bold text-lg sm:text-2xl'>Teams <br />Deployed</h1>
            </div>
          </div>


    </div>
  )
}
