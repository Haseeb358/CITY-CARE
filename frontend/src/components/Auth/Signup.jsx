import React from "react";

const Signup = () => {
  return (
    <main className="flex h-[calc(100vh-160px)] p-2 sm:p-11 gap-8 bg-gray-50 overflow-hidden">
      {/* Left side - Image with overlay text */}
      <div className="hidden md:block w-1/2 h-full relative rounded-2xl overflow-hidden lg:p-6">
        <img
          src="/src/assets/signup.jpg"
          alt="Signup"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent 
                      flex flex-col justify-end p-9  text-white"
        >
          <h2 className="text-3xl font-bold">Join us today!</h2>
          <p className="text-lg opacity-90">Create your account in seconds</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-2 sm:p-8 rounded-2xl shadow-black sm:shadow-xs">
          {/* Header */}
          <div className="mt-10">
            <h1 className="text-3xl font-bold text-gray-800">Create account</h1>
          </div>

          <form className="flex flex-col gap-2 mt-6">
            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                required
                type="tel"
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">City</label>
              <div className="relative">
                <select
                  required
                  defaultValue=""
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                            appearance-none cursor-pointer
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                           outline-none transition"
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  ▼
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 
                       rounded-lg hover:bg-blue-700 active:bg-blue-800
                       transition duration-200 transform hover:scale-[1.02]
                       focus:ring-4 focus:ring-blue-200 mt-4 cursor-pointer"
            >
              Sign up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              className="text-blue-600 font-medium hover:text-blue-700 
                        hover:underline cursor-pointer transition"
              href="/"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
