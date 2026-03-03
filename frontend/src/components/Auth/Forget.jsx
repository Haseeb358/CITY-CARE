import React from "react";

const Forget = () => {
  return (
    <main className="h-[calc(100vh-160px)] p-18 gap-8 bg-gray-50 overflow-hidden flex justify-around">
      {/* Left-side */}
      <div className="flex flex-col p-16 pb-0 gap-6 bg-gray-100">
        <button className="px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-semibold transition-all duration-300 shadow-sm hover:shadow-md w-fit cursor-pointer">
          <span className="font-extrabold pt-2">&lt;</span>{" "}
          <a href="/">Back to Login</a>
        </button>

        <h1 className="text-4xl font-bold">Forget Password</h1>
        <p>
          Don't worry, happens to all of us. Enter your email address below to
          recover your passord
        </p>
        <form className="flex flex-col justify-center gap-2 w-[60%]">
          <input
            className="p-1 w-full px-4 py-3 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                         outline-none transition"
            type="email"
            placeholder="john@example.com"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 
                       rounded-lg hover:bg-blue-700 active:bg-blue-800
                       transition duration-200 transform hover:scale-[1.02]
                       focus:ring-4 focus:ring-blue-200 mt-4 cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>

      {/* Right-side */}
      <div className="">
        <img
          src="./src/assets/forget-password.png"
          alt="Forget Password Illustration"
        />
      </div>
    </main>
  );
};

export default Forget;
