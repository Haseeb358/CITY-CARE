import React from 'react'

const Navbar = () => {
  return (
    <div className='h-36 flex items-center px-8 bg-gray-200 shadow-md'>  {/* Navbar container */}
  <div className='h-32 w-48'>  {/* Slightly smaller than navbar */}
    <img 
      src='/src/assets/logo.png' 
      alt='Logo'
      className='w-full h-full object-contain'  /* Image fits in box */
    />
  </div>
</div>
  )
}

export default Navbar
