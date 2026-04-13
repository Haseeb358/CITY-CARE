import React from 'react'
import { Link } from 'react-router-dom'
export default function AccesDenied() {
  return (
    <>
    {/* design a responsive access denied page with go to login button */}
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-8">You do not have permission to access this page.</p>
      <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Go to Home</Link>
    </div>
    </>
  )
}
