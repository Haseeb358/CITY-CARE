const Login = () => {
  return (
    <main className="flex h-[calc(100vh-160px)] p-11 gap-8">
      {/* Left side */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 border-2 rounded-2xl">
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <form className="flex flex-col gap-4 mb-5">
            <label htmlFor="email">Email</label>
            <input
              required
              id="email"
              type="email"
              className="w-full p-2 border rounded-sm"
            />

            <label htmlFor="password">Password</label>
            <input
              required
              id="password"
              type="password"
              className="w-full p-2 border rounded-sm"
            />

            <button className="text-red-500 text-left cursor-pointer">
              Forgot Password
            </button>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-2 rounded-sm cursor-pointer"
            >
              Login
            </button>
          </form>
          <span>
            Don't have an account?{" "}
            <a className="text-red-500 cursor-pointer">Sign up</a>
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-[80%] h-[80%]">
          <img
            src="/src/assets/login-image.png"
            alt="Login"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
